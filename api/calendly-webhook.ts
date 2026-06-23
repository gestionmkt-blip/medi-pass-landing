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
  if (event !== "invitee.created") {
    console.log(PREFIX, `Evento ignorado: ${event}`);
    return json({ ok: true });
  }

  const inviteeEmail: string | undefined = payload.payload?.email;
  const inviteeName: string | undefined = payload.payload?.name;
  const startTime: string | undefined = payload.payload?.scheduled_event?.start_time;

  if (!inviteeEmail) {
    console.error(PREFIX, "No se encontró correo en el payload");
    return json({ ok: true });
  }

  console.log(PREFIX, `invitee.created — ${inviteeName} <${inviteeEmail}>`);

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

  // --- Buscar lead por correo ---
  let pageId: string;
  let existingNotes = "";

  try {
    const queryRes = await fetch(
      `https://api.notion.com/v1/databases/${dbId}/query`,
      {
        method: "POST",
        headers: notionHeaders,
        body: JSON.stringify({
          filter: { property: "Correo", email: { equals: inviteeEmail } },
          sorts: [{ timestamp: "created_time", direction: "descending" }],
          page_size: 1,
        }),
      },
    );

    if (!queryRes.ok) {
      const errText = await queryRes.text();
      console.error(PREFIX, "Error buscando lead en Notion:", queryRes.status, errText);
      return json({ ok: true });
    }

    const queryData = await queryRes.json();
    const results = queryData.results ?? [];

    if (results.length === 0) {
      console.log(PREFIX, `Lead no encontrado por correo: ${inviteeEmail}`);
      return json({ ok: true });
    }

    pageId = results[0].id;

    const notasProperty = results[0].properties?.["Notas"];
    if (notasProperty?.rich_text?.length) {
      existingNotes = notasProperty.rich_text
        .map((t: any) => t.plain_text)
        .join("");
    }
  } catch (err) {
    console.error(PREFIX, "Excepción buscando lead:", err);
    return json({ ok: true });
  }

  // --- Formatear fecha legible ---
  let fechaLegible = startTime ?? "fecha no disponible";
  if (startTime) {
    try {
      fechaLegible = new Date(startTime).toLocaleString("es-MX", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "America/Mexico_City",
      });
    } catch {
      fechaLegible = startTime;
    }
  }

  const nuevaNota = `Discovery agendado vía Calendly para ${fechaLegible}.`;
  const notasCombinadas = existingNotes
    ? `${existingNotes}\n${nuevaNota}`
    : nuevaNota;

  // --- Actualizar lead ---
  try {
    const patchRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: "PATCH",
      headers: notionHeaders,
      body: JSON.stringify({
        properties: {
          Etapa: { select: { name: "Discovery agendado" } },
          "Fecha de próxima acción": {
            date: { start: startTime },
          },
          Notas: {
            rich_text: [{ text: { content: notasCombinadas } }],
          },
        },
      }),
    });

    if (!patchRes.ok) {
      const errText = await patchRes.text();
      console.error(PREFIX, "Error actualizando lead:", patchRes.status, errText);
      return json({ ok: true });
    }

    console.log(PREFIX, `Lead actualizado: ${pageId} → Discovery agendado`);
  } catch (err) {
    console.error(PREFIX, "Excepción actualizando lead:", err);
    return json({ ok: true });
  }

  return json({ ok: true });
}
