export const config = { runtime: "edge" };

const PREFIX = "[calendly-webhook]";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function verifySignature(rawBody: string, header: string, secret: string): Promise<boolean> {
  const parts = header.split(",");
  const tPart = parts.find((p) => p.startsWith("t="));
  const v1Part = parts.find((p) => p.startsWith("v1="));
  if (!tPart || !v1Part) return false;

  const timestamp = tPart.slice(2);
  const expectedSig = v1Part.slice(3);

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${rawBody}`));
  const computed = bytesToHex(new Uint8Array(signed));

  return timingSafeEqual(computed, expectedSig);
}

interface LeadResult {
  pageId: string;
  properties: Record<string, any>;
  existingNotes: string;
}

async function findLeadByEmail(
  email: string,
  notionHeaders: Record<string, string>,
  dbId: string,
): Promise<LeadResult | null> {
  const queryRes = await fetch(
    `https://api.notion.com/v1/databases/${dbId}/query`,
    {
      method: "POST",
      headers: notionHeaders,
      body: JSON.stringify({
        filter: { property: "Correo", email: { equals: email } },
        sorts: [{ timestamp: "created_time", direction: "descending" }],
        page_size: 1,
      }),
    },
  );

  if (!queryRes.ok) {
    const errText = await queryRes.text();
    console.error(PREFIX, "Error buscando lead en Notion:", queryRes.status, errText);
    return null;
  }

  const queryData = await queryRes.json();
  const results = queryData.results ?? [];
  if (results.length === 0) return null;

  const page = results[0];
  let existingNotes = "";
  const notasProperty = page.properties?.["Notas"];
  if (notasProperty?.rich_text?.length) {
    existingNotes = notasProperty.rich_text
      .map((t: any) => t.plain_text)
      .join("");
  }

  return { pageId: page.id, properties: page.properties, existingNotes };
}

function buildCombinedNotes(existing: string, newLine: string): string {
  return existing ? `${existing}\n${newLine}` : newLine;
}

function formatDateMX(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleString("es-MX", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "America/Mexico_City",
    });
  } catch {
    return isoDate;
  }
}

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return bytesToHex(new Uint8Array(hashBuffer));
}

async function sendCapiSchedule(
  email: string,
  eventUri: string | undefined,
  startTime: string | undefined,
): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID?.trim();
  const accessToken = process.env.META_ACCESS_TOKEN?.trim();
  if (!pixelId || !accessToken) {
    console.log(PREFIX, "CAPI: META_PIXEL_ID o META_ACCESS_TOKEN no configurados, omitiendo");
    return;
  }

  const eventID = eventUri
    ? `sched_${eventUri.split("/").pop()}`
    : `sched_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const eventTime = Math.floor(Date.now() / 1000);
  const customData = startTime ? { appointment_time: startTime } : undefined;

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${pixelId}/events`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            event_name: "Schedule",
            event_time: eventTime,
            event_id: eventID,
            action_source: "website",
            user_data: { em: [await sha256Hex(email)] },
            ...(customData && { custom_data: customData }),
          },
        ],
        access_token: accessToken,
      }),
    },
  );

  if (!res.ok) {
    const errText = await res.text();
    console.error(PREFIX, "CAPI: error enviando Schedule:", res.status, errText);
  } else {
    console.log(PREFIX, `CAPI: Schedule enviado — eventID: ${eventID}`);
  }
}

async function handleCreated(
  payload: any,
  notionHeaders: Record<string, string>,
  dbId: string,
): Promise<Response> {
  const inviteeEmail: string | undefined = payload.payload?.email;
  const inviteeName: string | undefined = payload.payload?.name;
  const startTime: string | undefined = payload.payload?.scheduled_event?.start_time;
  const eventUri: string | undefined = payload.payload?.scheduled_event?.uri;

  if (!inviteeEmail) {
    console.error(PREFIX, "created: no se encontró correo en el payload");
    return json({ ok: true });
  }

  console.log(PREFIX, `created: ${inviteeName} <${inviteeEmail}>`);

  try {
    await sendCapiSchedule(inviteeEmail, eventUri, startTime);
  } catch (err) {
    console.error(PREFIX, "CAPI: excepción:", err);
  }

  let lead: LeadResult | null;
  try {
    lead = await findLeadByEmail(inviteeEmail, notionHeaders, dbId);
  } catch (err) {
    console.error(PREFIX, "created: excepción buscando lead:", err);
    return json({ ok: true });
  }

  if (!lead) {
    console.log(PREFIX, `created: lead no encontrado por correo: ${inviteeEmail}`);
    return json({ ok: true });
  }

  const fechaLegible = startTime ? formatDateMX(startTime) : "fecha no disponible";
  const nuevaNota = `Discovery agendado vía Calendly para ${fechaLegible}.`;
  const notasCombinadas = buildCombinedNotes(lead.existingNotes, nuevaNota);

  try {
    const patchRes = await fetch(`https://api.notion.com/v1/pages/${lead.pageId}`, {
      method: "PATCH",
      headers: notionHeaders,
      body: JSON.stringify({
        properties: {
          Etapa: { select: { name: "Discovery agendado" } },
          "Fecha de próxima acción": {
            date: startTime ? { start: startTime } : null,
          },
          Notas: {
            rich_text: [{ text: { content: notasCombinadas } }],
          },
        },
      }),
    });

    if (!patchRes.ok) {
      const errText = await patchRes.text();
      console.error(PREFIX, "created: error actualizando lead:", patchRes.status, errText);
      return json({ ok: true });
    }

    console.log(PREFIX, `created: lead actualizado: ${lead.pageId} → Discovery agendado`);
  } catch (err) {
    console.error(PREFIX, "created: excepción actualizando lead:", err);
  }

  return json({ ok: true });
}

async function handleCanceled(
  payload: any,
  notionHeaders: Record<string, string>,
  dbId: string,
): Promise<Response> {
  const inviteeEmail: string | undefined = payload.payload?.email;
  const inviteeName: string | undefined = payload.payload?.name;
  const rescheduled: boolean = payload.payload?.rescheduled === true;
  const cancelReason: string = payload.payload?.cancellation?.reason || "no especificado";
  const canceledBy: string = payload.payload?.cancellation?.canceled_by || "desconocido";

  if (!inviteeEmail) {
    console.error(PREFIX, "canceled: no se encontró correo en el payload");
    return json({ ok: true });
  }

  if (rescheduled) {
    console.log(PREFIX, `canceled: es reagenda, se ignora (el created trae la fecha nueva) — ${inviteeName} <${inviteeEmail}>`);
    return json({ ok: true });
  }

  console.log(PREFIX, `canceled: ${inviteeName} <${inviteeEmail}> — cancelado por: ${canceledBy}`);

  let lead: LeadResult | null;
  try {
    lead = await findLeadByEmail(inviteeEmail, notionHeaders, dbId);
  } catch (err) {
    console.error(PREFIX, "canceled: excepción buscando lead:", err);
    return json({ ok: true });
  }

  if (!lead) {
    console.log(PREFIX, `canceled: lead no encontrado por correo: ${inviteeEmail}`);
    return json({ ok: true });
  }

  const ahora = formatDateMX(new Date().toISOString());
  const nuevaNota = `Cita cancelada vía Calendly el ${ahora}. Motivo: ${cancelReason}.`;
  const notasCombinadas = buildCombinedNotes(lead.existingNotes, nuevaNota);

  const etapaActual: string = lead.properties?.["Etapa"]?.select?.name ?? "";
  const esDiscoveryAgendado = etapaActual === "Discovery agendado";

  const patchProperties: Record<string, any> = {
    Notas: {
      rich_text: [{ text: { content: notasCombinadas } }],
    },
  };

  if (esDiscoveryAgendado) {
    patchProperties["Etapa"] = { select: { name: "Cita cancelada" } };
    patchProperties["Fecha de próxima acción"] = { date: null };
  }

  try {
    const patchRes = await fetch(`https://api.notion.com/v1/pages/${lead.pageId}`, {
      method: "PATCH",
      headers: notionHeaders,
      body: JSON.stringify({ properties: patchProperties }),
    });

    if (!patchRes.ok) {
      const errText = await patchRes.text();
      console.error(PREFIX, "canceled: error actualizando lead:", patchRes.status, errText);
      return json({ ok: true });
    }

    if (esDiscoveryAgendado) {
      console.log(PREFIX, `canceled: lead actualizado: ${lead.pageId} → Cita cancelada`);
    } else {
      console.log(PREFIX, `canceled: lead ${lead.pageId} en etapa "${etapaActual}", solo se agregó nota`);
    }
  } catch (err) {
    console.error(PREFIX, "canceled: excepción actualizando lead:", err);
  }

  return json({ ok: true });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  if (!signingKey) {
    console.error(PREFIX, "Falta CALENDLY_WEBHOOK_SIGNING_KEY");
    return json({ error: "Unauthorized" }, 401);
  }

  const sigHeader = req.headers.get("Calendly-Webhook-Signature");
  if (!sigHeader) {
    console.error(PREFIX, "Falta header Calendly-Webhook-Signature");
    return json({ error: "Unauthorized" }, 401);
  }

  const rawBody = await req.text();

  if (!(await verifySignature(rawBody, sigHeader, signingKey))) {
    console.error(PREFIX, "Firma inválida");
    return json({ error: "Unauthorized" }, 401);
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    console.error(PREFIX, "Body no es JSON válido");
    return json({ error: "Bad request" }, 400);
  }

  const event = payload.event;

  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_DATABASE_ID;

  if (!token || !dbId) {
    console.error(PREFIX, "Faltan NOTION_TOKEN o NOTION_DATABASE_ID");
    return json({ ok: true });
  }

  const notionHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28",
  };

  if (event === "invitee.created") {
    return handleCreated(payload, notionHeaders, dbId);
  } else if (event === "invitee.canceled") {
    return handleCanceled(payload, notionHeaders, dbId);
  } else {
    console.log(PREFIX, `Evento ignorado: ${event}`);
    return json({ ok: true });
  }
}
