import { z } from "zod";

const leadSchema = z.object({
  empresa: z.string().min(1, "Empresa requerida"),
  contacto: z.string().optional(),
  puesto: z.string().optional(),
  correo: z.string().email("Correo inválido"),
  whatsapp: z.string().optional(),
  ciudad: z.string().optional(),
  colaboradores: z.number().optional(),
  seguroActual: z.string().optional(),
});

type LeadInput = z.infer<typeof leadSchema>;

export async function submitLeadFn({ data }: { data: LeadInput }): Promise<{ success: boolean }> {
  const response = await fetch("/api/submit-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al guardar tus datos");
  }

  return response.json() as Promise<{ success: boolean }>;
}

/** Parsea el rango de colaboradores al límite inferior numérico.
 *  "1 – 10" → 1 | "11 – 30" → 11 | "31 – 100" → 31 | "100+" → 100
 */
export function parseColaboradores(val: string): number | undefined {
  if (!val) return undefined;
  const n = parseInt(val.replace(/\s*[–+].*$/, ""), 10);
  return isNaN(n) ? undefined : n;
}

/** Mapea las opciones del quiz al valor select de Notion: "Sí" | "No" | "No sé" */
export function mapSalud(val: string): string | undefined {
  if (!val) return undefined;
  if (val.startsWith("Sí")) return "Sí";
  if (val === "No tenemos nada") return "No";
  if (val === "No estoy seguro") return "No sé";
  return undefined;
}
