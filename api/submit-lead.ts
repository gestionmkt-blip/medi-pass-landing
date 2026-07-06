import { z } from "zod";

export const config = { runtime: "edge" };

// Database ID esperado: 3646eeb28f1c802a9c34e3d3276b7d56
const leadSchema = z.object({
  empresa: z.string().optional(),
  contacto: z.string().optional(),
  puesto: z.string().optional(),
  correo: z.string().email().optional(),
  whatsapp: z.string().optional(),
  ciudad: z.string().optional(),
  colaboradores: z.string().optional(), // rango raw, e.g. "20 – 50"
  seguroActual: z.string().optional(),
  eventID: z.string().optional(),
  fbp: z.string().optional(),
  fbc: z.string().optional(),
});

const PREFIX = "[submit-lead]";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return bytesToHex(new Uint8Array(hashBuffer));
}

async function sendCapiLead(params: {
  correo: string;
  whatsapp: string | undefined;
  eventID: string | undefined;
  sourceUrl: string;
  fbp: string | undefined;
  fbc: string | undefined;
  clientIp: string | undefined;
  userAgent: string | undefined;
}): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID?.trim();
  const accessToken = process.env.META_ACCESS_TOKEN?.trim();
  if (!pixelId || !accessToken) {
    console.log(PREFIX, "CAPI: META_PIXEL_ID o META_ACCESS_TOKEN no configurados, omitiendo");
    return;
  }

  const userData: Record<string, string | string[]> = {
    em: [await sha256Hex(params.correo)],
  };
  if (params.whatsapp) {
    userData.ph = [await sha256Hex(params.whatsapp)];
  }
  if (params.fbp) userData.fbp = params.fbp;
  if (params.fbc) userData.fbc = params.fbc;
  if (params.clientIp) userData.client_ip_address = params.clientIp;
  if (params.userAgent) userData.client_user_agent = params.userAgent;

  const capiEventID =
    params.eventID ?? `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  // Temporal para pruebas en Meta Events Manager — quitar META_TEST_EVENT_CODE de Vercel cuando termine de validarse
  const testEventCode = process.env.META_TEST_EVENT_CODE?.trim();

  const res = await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [
        {
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          event_id: capiEventID,
          action_source: "website",
          event_source_url: params.sourceUrl,
          user_data: userData,
        },
      ],
      access_token: accessToken,
      ...(testEventCode ? { test_event_code: testEventCode } : {}),
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(PREFIX, "CAPI: error enviando Lead:", res.status, errText);
  } else {
    console.log(PREFIX, `CAPI: Lead enviado — eventID: ${capiEventID}, status: ${res.status}`);
  }
}

// Convierte "20 – 50" → 20, "150 – 250" → 150, etc.
function rangeToNumber(val: string | undefined): number | undefined {
  if (!val) return undefined;
  const n = parseInt(val.replace(/\s*[–\-].*$/, ""), 10);
  return isNaN(n) ? undefined : n;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    console.error(PREFIX, "Validación fallida:", JSON.stringify(parsed.error));
    return json({ error: "Datos inválidos" }, 422);
  }

  const { empresa, contacto, puesto, correo, whatsapp, ciudad, colaboradores, seguroActual, eventID, fbp, fbc } =
    parsed.data;

  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_DATABASE_ID;

  if (!token || !dbId) {
    console.error(PREFIX, "Faltan NOTION_TOKEN o NOTION_DATABASE_ID");
    return json({ error: "Server config error" }, 500);
  }

  // Empresa (title) no puede ir vacío en Notion
  const empresaFinal = empresa?.trim() || contacto?.trim() || "Sin empresa";

  const properties: Record<string, unknown> = {
    Empresa: { title: [{ text: { content: empresaFinal } }] },
    Etapa: { select: { name: "Nuevo lead" } },
    Fuente: { select: { name: "Landing MediPass" } },
    "Primer Contacto": { date: { start: new Date().toISOString().split("T")[0] } },
  };

  if (contacto?.trim())
    properties["Contacto"] = { rich_text: [{ text: { content: contacto.trim() } }] };

  if (correo?.trim())
    properties["Correo"] = { email: correo.trim() };

  if (whatsapp?.trim())
    properties["WhatsApp"] = { phone_number: whatsapp.trim() };

  if (ciudad?.trim())
    properties["Ciudad"] = { rich_text: [{ text: { content: ciudad.trim() } }] };

  if (puesto?.trim())
    properties["Puesto"] = { rich_text: [{ text: { content: puesto.trim() } }] };

  const colaboradoresNum = rangeToNumber(colaboradores);
  if (colaboradoresNum !== undefined)
    properties["# Colaboradores"] = { number: colaboradoresNum };

  if (seguroActual)
    properties["Seguro actual"] = { select: { name: seguroActual } };

  // Guardar rango original en Notas
  if (colaboradores)
    properties["Notas"] = {
      rich_text: [{ text: { content: `Rango seleccionado: ${colaboradores}` } }],
    };

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({ parent: { database_id: dbId }, properties }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(PREFIX, "Notion API error:", res.status, errorBody);
    console.error(
      "LEAD_FALLBACK",
      JSON.stringify({ empresa, contacto, puesto, correo, whatsapp, ciudad, colaboradores, seguroActual, timestamp: new Date().toISOString() })
    );
    return json({ error: "Error al guardar en Notion" }, 502);
  }

  if (correo?.trim()) {
    try {
      await sendCapiLead({
        correo: correo.trim(),
        whatsapp: whatsapp?.trim() || undefined,
        eventID,
        sourceUrl: req.headers.get("referer") ?? "https://medipass.mx",
        fbp,
        fbc,
        clientIp: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
        userAgent: req.headers.get("user-agent") ?? undefined,
      });
    } catch (err) {
      console.error(PREFIX, "CAPI: excepción:", err);
    }
  }

  return json({ success: true });
}
