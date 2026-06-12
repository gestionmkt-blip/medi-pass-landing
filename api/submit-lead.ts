import { z } from "zod";

export const config = { runtime: "edge" };

const leadSchema = z.object({
  empresa: z.string().min(1),
  contacto: z.string().optional(),
  puesto: z.string().optional(),
  correo: z.string().email(),
  whatsapp: z.string().optional(),
  ciudad: z.string().optional(),
  colaboradores: z.number().optional(),
  seguroActual: z.string().optional(),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) return json({ error: "Datos inválidos" }, 422);

  const { empresa, contacto, puesto, correo, whatsapp, ciudad, colaboradores, seguroActual } =
    parsed.data;

  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_DATABASE_ID;

  if (!token || !dbId) {
    console.error("[submit-lead] Faltan NOTION_TOKEN o NOTION_DATABASE_ID");
    return json({ error: "Server config error" }, 500);
  }

  const properties: Record<string, unknown> = {
    Empresa: { title: [{ text: { content: empresa } }] },
    Etapa: { select: { name: "Nuevo lead" } },
    Fuente: { select: { name: "Landing MediPass" } },
    "Primer Contacto": { date: { start: new Date().toISOString().split("T")[0] } },
  };

  if (contacto) properties["Contacto"] = { rich_text: [{ text: { content: contacto } }] };
  if (puesto) properties["Puesto"] = { rich_text: [{ text: { content: puesto } }] };
  if (correo) properties["Correo"] = { email: correo };
  if (whatsapp) properties["WhatsApp"] = { phone_number: whatsapp };
  if (ciudad) properties["Ciudad"] = { rich_text: [{ text: { content: ciudad } }] };
  if (colaboradores !== undefined) properties["# Colaboradores"] = { number: colaboradores };
  if (seguroActual) properties["Seguro actual"] = { select: { name: seguroActual } };

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
    console.error("[submit-lead] Notion API error:", res.status, await res.text());
    return json({ error: "Error al guardar en Notion" }, 502);
  }

  return json({ success: true });
}
