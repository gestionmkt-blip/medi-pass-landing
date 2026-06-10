import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Reveal } from "@/components/medipass/Reveal";

export const Route = createFileRoute("/")({
  component: MediPassLanding,
  head: () => ({
    meta: [
      { title: "MediPass — Respaldo de salud para tu equipo" },
      {
        name: "description",
        content:
          "Membresía de salud para empresas en México. Orientación médica 24/7, videoconsultas y médico a domicilio desde $450 al año por persona.",
      },
    ],
  }),
});

const CORAL = "#EA6B48";
const BG_DARK = "#111";
const TEXT_MUTED = "#aaa";
const VSL_BG = "#000";
const VSL_BORDER = "#2a2a2a";

const schema = z.object({
  nombre: z.string().min(2, "Escribe tu nombre"),
  empresa: z.string().min(2, "Escribe el nombre de tu empresa"),
  puesto: z.string().min(2, "Escribe tu puesto"),
  whatsapp: z.string().min(10, "Escribe tu número de WhatsApp"),
  correo: z.string().email("Escribe un correo válido"),
  colaboradores: z.string().min(1, "Indica el número de colaboradores"),
  ciudad: z.string().min(2, "Escribe tu ciudad"),
  seguro: z.enum(["si", "no", "no_se"] as const, {
    errorMap: () => ({ message: "Elige una opción" }),
  }),
});

type FormData = z.infer<typeof schema>;

const inputCls = (hasError: boolean) =>
  `w-full rounded-lg border px-4 py-3 text-sm text-black outline-none transition-colors focus:border-[#EA6B48] ${
    hasError ? "border-red-400 bg-red-50" : "border-[#e8e8e8] bg-[#f7f7f7]"
  }`;

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#444" }}>
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function MediPassLanding() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div id="top" className="min-h-screen" style={{ background: BG_DARK }}>
      <Nav />
      <main>
        {submitted ? (
          <ThankYou />
        ) : (
          <>
            <HeroSection />
            <FormSection onSubmit={() => setSubmitted(true)} />
            <TrustSignals />
          </>
        )}
      </main>
      <PageFooter />
    </div>
  );
}

// ── Componentes (se definen en tareas siguientes) ──────────────────────────
function Nav() {
  return (
    <header
      className="sticky top-0 z-40"
      style={{ background: BG_DARK, borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-5">
        <a href="#top" aria-label="MediPass inicio">
          <img
            src={`${import.meta.env.BASE_URL}medipass-logo.png`}
            alt="MediPass"
            style={{ height: 30 }}
          />
        </a>
        <button
          onClick={() =>
            document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" })
          }
          type="button"
          className="rounded-full px-5 py-2.5 text-sm font-bold text-white transition-transform hover:opacity-90 active:scale-95"
          style={{ background: CORAL }}
        >
          Cotización gratis
        </button>
      </div>
    </header>
  );
}
function HeroSection() {
  return (
    <section className="px-5 pb-8 pt-10 text-center" style={{ background: BG_DARK }}>
      <div className="mx-auto max-w-xl">
        <Reveal>
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
            style={{
              background: "rgba(234,107,72,0.12)",
              color: CORAL,
              border: "1px solid rgba(234,107,72,0.25)",
            }}
          >
            Para dueños de empresa
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1
            className="mt-5 font-black leading-tight tracking-tight text-white"
            style={{ fontSize: "clamp(26px, 7vw, 40px)" }}
          >
            Protege la salud de tu equipo{" "}
            <span style={{ color: CORAL }}>sin pagar un seguro caro</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
            Mira el video y descubre cómo más de 1,000 colaboradores ya tienen respaldo médico
            desde $450 al año.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mx-auto mt-7">
            {/* VSL placeholder — reemplazar con <iframe> de YouTube/Vimeo cuando esté listo */}
            <div
              className="relative w-full overflow-hidden rounded-xl"
              style={{ aspectRatio: "16/9", background: VSL_BG, border: `1px solid ${VSL_BORDER}` }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full"
                  style={{
                    background: CORAL,
                    boxShadow: "0 0 0 16px rgba(234,107,72,0.12)",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="white"
                    aria-hidden="true"
                    focusable="false"
                    style={{ marginLeft: "3px" }}
                  >
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="mt-2 text-xs" style={{ color: "#555" }}>
              ⏱ Video de 3 minutos — míralo completo antes de cotizar
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
function FormSection({ onSubmit }: { onSubmit: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const submit = (_data: FormData) => {
    // TODO: aquí va la integración con backend/CRM cuando esté listo
    onSubmit();
  };

  return (
    <section id="formulario" className="bg-white px-5 py-10">
      <div className="mx-auto max-w-lg">
        <Reveal>
          <span
            className="mb-2 inline-block text-xs font-bold uppercase tracking-widest"
            style={{ color: CORAL }}
          >
            Cotización gratuita
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="font-black tracking-tight text-black"
            style={{ fontSize: "clamp(22px, 5vw, 28px)" }}
          >
            Solicita tu propuesta personalizada
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "#666" }}>
            Sin costo ni compromiso. Un asesor te contacta en menos de 24 hrs.
          </p>
        </Reveal>

        <Reveal delay={180}>
          <form onSubmit={handleSubmit(submit)} className="mt-6 space-y-3" noValidate>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Nombre completo" error={errors.nombre?.message}>
                <input
                  {...register("nombre")}
                  placeholder="Tu nombre"
                  className={inputCls(!!errors.nombre)}
                />
              </Field>
              <Field label="Empresa" error={errors.empresa?.message}>
                <input
                  {...register("empresa")}
                  placeholder="Nombre de tu empresa"
                  className={inputCls(!!errors.empresa)}
                />
              </Field>
            </div>

            <Field label="Puesto" error={errors.puesto?.message}>
              <input
                {...register("puesto")}
                placeholder="CEO, Director de RRHH, Gerente…"
                className={inputCls(!!errors.puesto)}
              />
            </Field>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="WhatsApp" error={errors.whatsapp?.message}>
                <input
                  {...register("whatsapp")}
                  placeholder="+52 55 1234 5678"
                  type="tel"
                  className={inputCls(!!errors.whatsapp)}
                />
              </Field>
              <Field label="Correo electrónico" error={errors.correo?.message}>
                <input
                  {...register("correo")}
                  placeholder="tu@empresa.com"
                  type="email"
                  className={inputCls(!!errors.correo)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="No. de colaboradores" error={errors.colaboradores?.message}>
                <input
                  {...register("colaboradores")}
                  placeholder="Ej: 15"
                  type="number"
                  min="1"
                  className={inputCls(!!errors.colaboradores)}
                />
              </Field>
              <Field label="Ciudad" error={errors.ciudad?.message}>
                <input
                  {...register("ciudad")}
                  placeholder="Mérida, CDMX…"
                  className={inputCls(!!errors.ciudad)}
                />
              </Field>
            </div>

            <Field
              label="¿Tienen algún seguro o beneficio de salud?"
              error={errors.seguro?.message}
            >
              <select {...register("seguro")} className={inputCls(!!errors.seguro)}>
                <option value="">Elige una opción</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
                <option value="no_se">No sé</option>
              </select>
            </Field>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full rounded-full py-4 text-base font-black text-white transition-transform active:scale-95 disabled:opacity-60"
              style={{ background: CORAL }}
            >
              {isSubmitting ? "Enviando…" : "Quiero mi cotización →"}
            </button>
            <p className="text-center text-xs" style={{ color: "#bbb" }}>
              Sin spam. Solo te contactamos para enviarte tu propuesta.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
function ThankYou() { return null; }
function TrustSignals() { return null; }
function PageFooter() { return null; }
