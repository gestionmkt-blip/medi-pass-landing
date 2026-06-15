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
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

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
    console.error("[submit-lead] Validación fallida:", JSON.stringify(parsed.error));
    return json({ error: "Datos inválidos" }, 422);
  }

  const { empresa, contacto, puesto, correo, whatsapp, ciudad, colaboradores, seguroActual } =
    parsed.data;

  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_DATABASE_ID;

  if (!token || !dbId) {
    console.error("[submit-lead] Faltan NOTION_TOKEN o NOTION_DATABASE_ID");
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
    console.error("[submit-lead] Notion API error:", res.status, errorBody);
    return json({ error: "Error al guardar en Notion" }, 502);
  }

  return json({ success: true });
}
