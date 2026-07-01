import { z } from "zod";

const leadSchema = z.object({
  empresa: z.string().min(1, "Empresa requerida"),
  contacto: z.string().optional(),
  puesto: z.string().optional(),
  correo: z.string().email("Correo inválido"),
  whatsapp: z.string().optional(),
  ciudad: z.string().optional(),
  colaboradores: z.string().optional(), // rango raw, e.g. "20 – 50"
  seguroActual: z.string().optional(),
  eventID: z.string().optional(),
  fbp: z.string().optional(),
  fbc: z.string().optional(),
});

type LeadInput = z.infer<typeof leadSchema>;

export async function submitLeadFn({ data }: { data: LeadInput }): Promise<{ success: boolean }> {
  const response = await fetch("/api/submit-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "(no body)");
    console.error("[submitLeadFn] Error:", response.status, errorText);
    throw new Error("Error al guardar tus datos");
  }

  return response.json() as Promise<{ success: boolean }>;
}

/** Mapea las opciones del quiz al valor select de Notion: "Sí" | "No" | "No sé" */
export function mapSalud(val: string): string | undefined {
  if (!val) return undefined;
  if (val.startsWith("Sí")) return "Sí";
  if (val === "No tenemos nada") return "No";
  if (val === "No estoy seguro") return "No sé";
  return undefined;
}
