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
// TODO deploy-blocker: reemplazar con URL real antes de publicar
const CALENDLY_URL = "https://calendly.com/TU_LINK_AQUI";

type QuizAnswers = {
  colaboradores: string;
  rol: string;
  salud: string;
  nombre: string;
  correo: string;
  whatsapp: string;
};

const QUIZ_STEPS = [
  {
    key: "colaboradores" as const,
    question: "¿Cuántos colaboradores tiene tu empresa?",
    options: ["1 – 10", "11 – 30", "31 – 100", "100+"] as const,
    grid: true,
  },
  {
    key: "rol" as const,
    question: "¿Cuál es tu rol en la empresa?",
    options: [
      "Dueño / CEO / Director General",
      "Director / Gerente de RRHH",
      "Gerente o Coordinador",
      "Otro — tomo decisiones de beneficios",
    ] as const,
    grid: false,
  },
  {
    key: "salud" as const,
    question: "¿Hoy tienen algún beneficio de salud para su equipo?",
    options: [
      "Sí — seguro médico privado",
      "Sí — solo IMSS / ISSSTE",
      "No tenemos nada",
      "No estoy seguro",
    ] as const,
    grid: false,
  },
] as const;

type SelectionStepConfig = (typeof QUIZ_STEPS)[number];

const schema = z.object({
  nombre: z.string().min(2, "Escribe tu nombre"),
  empresa: z.string().min(2, "Escribe el nombre de tu empresa"),
  puesto: z.string().min(2, "Escribe tu puesto"),
  whatsapp: z.string().min(10, "Escribe tu número de WhatsApp"),
  correo: z.string().email("Escribe un correo válido"),
  colaboradores: z.coerce.number().min(1, "Indica el número de colaboradores"),
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
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold" style={{ color: "#444" }}>
          {label}
        </span>
        {children}
      </label>
      {error && <p role="alert" className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

const CALL_EXPECTATIONS = [
  "Entender el tamaño y necesidades de tu equipo",
  "Explicarte qué plan se adapta mejor a tu empresa",
  "Enviarte una propuesta con precio exacto al terminar",
] as const;

function MediPassLanding() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div id="top" className="min-h-screen" style={{ background: BG_DARK }}>
      <main>
        {submitted ? (
          <ThankYou />
        ) : (
          <>
            <HeroSection />
            <FaqSection />
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
function ThankYou() {
  const [checked, setChecked] = useState(false);

  return (
    <section className="px-5 py-12" style={{ background: BG_DARK }}>
      <div className="mx-auto max-w-lg text-center">
        <Reveal>
          <div className="mb-4 text-5xl" aria-hidden="true">🎉</div>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="font-black leading-tight text-white"
            style={{ fontSize: "clamp(22px, 5vw, 28px)" }}
          >
            ¡Listo! Ya recibimos tu solicitud
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
            El siguiente paso es agendar una llamada de 20 minutos con un miembro de nuestro
            equipo.
          </p>
        </Reveal>

        {/* Expectativas de la llamada */}
        <Reveal delay={200}>
          <div className="mt-8 text-left">
            <p
              className="mb-3 text-xs font-bold uppercase tracking-widest"
              style={{ color: CORAL }}
            >
              En la llamada vamos a:
            </p>
            <div
              className="overflow-hidden rounded-xl"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {CALL_EXPECTATIONS.map((item, i) => (
                <div
                  key={item}
                  className="flex items-start gap-3 px-4 py-3"
                  style={{
                    borderBottom:
                      i < CALL_EXPECTATIONS.length - 1
                        ? "1px solid rgba(255,255,255,0.06)"
                        : undefined,
                  }}
                >
                  <div
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                    style={{ background: CORAL }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm leading-snug" style={{ color: "#ccc" }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Badge */}
        <Reveal delay={260}>
          <div className="mt-5">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
              style={{
                background: "rgba(234,107,72,0.1)",
                color: CORAL,
                border: "1px solid rgba(234,107,72,0.25)",
              }}
            >
              📅 Llamada de 20 minutos · Gratis · Sin compromiso
            </span>
          </div>
        </Reveal>

        {/* Checkbox de compromiso */}
        <Reveal delay={320}>
          <label
            className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#EA6B48]"
            style={{
              borderColor: checked ? CORAL : "rgba(255,255,255,0.1)",
              background: checked ? "rgba(234,107,72,0.08)" : "rgba(255,255,255,0.04)",
            }}
          >
            <div
              className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all"
              style={{
                borderColor: checked ? CORAL : "#555",
                background: checked ? CORAL : "transparent",
              }}
              aria-hidden="true"
            >
              {checked && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              className="sr-only"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <span className="text-xs leading-relaxed" style={{ color: "#bbb" }}>
              Confirmo que soy responsable de tomar o proponer decisiones de beneficios en mi
              empresa, y que quiero recibir una propuesta real para mis colaboradores.
            </span>
          </label>
        </Reveal>

        {/* Botón Calendly — deshabilitado hasta que el checkbox esté palomeado */}
        <Reveal delay={380}>
          {checked ? (
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block w-full rounded-full py-4 text-center text-base font-black text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(234,107,72,0.35)]"
              style={{ background: CORAL }}
            >
              Agendar mi llamada →
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="mt-4 block w-full rounded-full py-4 text-center text-base font-black transition-all"
              style={{ background: "#2a2a2a", color: "#555", cursor: "not-allowed" }}
            >
              Agendar mi llamada →
            </button>
          )}
          <p className="mt-2 text-xs" style={{ color: checked ? "#777" : "#444" }}>
            {checked
              ? "Todo listo — selecciona tu horario"
              : "Confirma el recuadro de arriba para continuar"}
          </p>
        </Reveal>

        <Reveal delay={440}>
          <hr className="my-6" style={{ borderColor: "rgba(255,255,255,0.06)" }} />
          <p className="text-xs leading-relaxed" style={{ color: "#444" }}>
            MediPass no es una aseguradora. Los servicios se brindan a través de proveedores en convenio.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
const FAQS = [
  {
    q: "¿Pregunta frecuente 1?",
    a: "Respuesta placeholder. Aquí irá la respuesta real.",
  },
  {
    q: "¿Pregunta frecuente 2?",
    a: "Respuesta placeholder. Aquí irá la respuesta real.",
  },
  {
    q: "¿Pregunta frecuente 3?",
    a: "Respuesta placeholder. Aquí irá la respuesta real.",
  },
  {
    q: "¿Pregunta frecuente 4?",
    a: "Respuesta placeholder. Aquí irá la respuesta real.",
  },
  {
    q: "¿Pregunta frecuente 5?",
    a: "Respuesta placeholder. Aquí irá la respuesta real.",
  },
] as const;

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-5 py-12" style={{ background: BG_DARK }}>
      <div className="mx-auto max-w-lg">
        <Reveal>
          <h2
            className="mb-8 font-black tracking-tight text-white"
            style={{ fontSize: "clamp(22px, 5vw, 28px)" }}
          >
            Preguntas frecuentes
          </h2>
        </Reveal>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <Reveal key={i} delay={i * 60}>
              <div
                className="overflow-hidden rounded-xl"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors"
                  style={{
                    background: open === i ? "rgba(234,107,72,0.07)" : "rgba(255,255,255,0.03)",
                  }}
                >
                  <span className="pr-4 text-sm font-semibold text-white">{faq.q}</span>
                  <span
                    className="flex-shrink-0 text-lg transition-transform"
                    style={{
                      color: CORAL,
                      transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                {open === i && (
                  <div
                    className="px-5 pb-5 pt-1 text-sm leading-relaxed"
                    style={{ color: TEXT_MUTED }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={step + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label="Progreso del cuestionario"
      className="mb-5 flex gap-1.5"
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1 flex-1 rounded-full transition-all duration-300"
          style={{
            background:
              i < step
                ? CORAL
                : i === step
                  ? `${CORAL}99`
                  : "rgba(255,255,255,0.1)",
          }}
        />
      ))}
    </div>
  );
}

function SelectionStep({
  config,
  value,
  onChange,
}: {
  config: SelectionStepConfig;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <p
        className="mb-4 font-black text-white"
        style={{ fontSize: "clamp(15px, 3.5vw, 17px)", lineHeight: 1.35 }}
      >
        {config.question}
      </p>
      <div className={config.grid ? "grid grid-cols-2 gap-2" : "flex flex-col gap-2"}>
        {config.options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className="rounded-xl px-4 py-3 text-left text-sm font-medium transition-all active:scale-[0.98]"
            style={{
              background: value === opt ? CORAL : "rgba(255,255,255,0.05)",
              border: `1px solid ${value === opt ? CORAL : "rgba(255,255,255,0.1)"}`,
              color: value === opt ? "white" : "#ccc",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ContactStep({
  answers,
  errors,
  onChange,
}: {
  answers: QuizAnswers;
  errors: Partial<Record<keyof QuizAnswers, string>>;
  onChange: (field: keyof QuizAnswers, val: string) => void;
}) {
  const fields = [
    { key: "nombre" as const, placeholder: "Nombre completo", type: "text" },
    { key: "correo" as const, placeholder: "tu@empresa.com", type: "email" },
    { key: "whatsapp" as const, placeholder: "+52 55 1234 5678 (WhatsApp)", type: "tel" },
  ];

  return (
    <div>
      <p
        className="mb-4 font-black text-white"
        style={{ fontSize: "clamp(15px, 3.5vw, 17px)", lineHeight: 1.35 }}
      >
        ¡Ya casi! ¿A dónde te enviamos la propuesta?
      </p>
      <div className="flex flex-col gap-3">
        {fields.map(({ key, placeholder, type }) => (
          <div key={key}>
            <label htmlFor={key} className="sr-only">{placeholder}</label>
            <input
              id={key}
              type={type}
              placeholder={placeholder}
              value={answers[key]}
              onChange={(e) => onChange(key, e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[#555]"
              style={{
                background: errors[key] ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${errors[key] ? "#ef4444" : "rgba(255,255,255,0.12)"}`,
              }}
            />
            {errors[key] && (
              <p role="alert" className="mt-1 text-xs text-red-400">
                {errors[key]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function QuizSection({ onSubmit }: { onSubmit: () => void }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    colaboradores: "",
    rol: "",
    salud: "",
    nombre: "",
    correo: "",
    whatsapp: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof QuizAnswers, string>>>({});

  const TOTAL_STEPS = 4;
  const isSelectionStep = step < 3;
  const currentConfig = isSelectionStep ? QUIZ_STEPS[step as 0 | 1 | 2] : null;
  const currentValue = isSelectionStep ? answers[QUIZ_STEPS[step as 0 | 1 | 2].key] : "";

  const canAdvance = isSelectionStep
    ? !!currentValue
    : answers.nombre.trim().length >= 2 &&
      /\S+@\S+\.\S+/.test(answers.correo) &&
      answers.whatsapp.trim().length >= 10;

  const goNext = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleSubmit = () => {
    const newErrors: Partial<Record<keyof QuizAnswers, string>> = {};
    if (answers.nombre.trim().length < 2) newErrors.nombre = "Escribe tu nombre";
    if (!/\S+@\S+\.\S+/.test(answers.correo)) newErrors.correo = "Escribe un correo válido";
    if (answers.whatsapp.trim().length < 10) newErrors.whatsapp = "Escribe tu número de WhatsApp";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit();
  };

  const slideClass = direction === 1 ? "quiz-slide-right" : "quiz-slide-left";

  return (
    <section id="formulario" className="px-5 py-10" style={{ background: BG_DARK }}>
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
            className="font-black tracking-tight text-white"
            style={{ fontSize: "clamp(22px, 5vw, 28px)" }}
          >
            Solicita tu propuesta personalizada
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-2 mb-6 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
            Sin costo ni compromiso. Un asesor te contacta en menos de 24 hrs.
          </p>
        </Reveal>

        <Reveal delay={180}>
          <div
            className="overflow-hidden rounded-2xl p-6"
            style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <ProgressBar step={step} total={TOTAL_STEPS} />

            <div key={step} className={slideClass}>
              {currentConfig ? (
                <SelectionStep
                  config={currentConfig}
                  value={currentValue}
                  onChange={(val) =>
                    setAnswers((a) => ({ ...a, [currentConfig.key]: val }))
                  }
                />
              ) : (
                <ContactStep
                  answers={answers}
                  errors={errors}
                  onChange={(field, val) => {
                    setAnswers((a) => ({ ...a, [field]: val }));
                    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
                  }}
                />
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 0}
                aria-hidden={step === 0}
                className="text-sm transition-opacity hover:opacity-80"
                style={{
                  color: "#666",
                  visibility: step === 0 ? "hidden" : "visible",
                }}
              >
                ← Atrás
              </button>

              {isSelectionStep ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canAdvance}
                  className="rounded-full px-6 py-2.5 text-sm font-bold text-white transition-all active:scale-95"
                  style={{
                    background: canAdvance ? CORAL : "#2a2a2a",
                    opacity: canAdvance ? 1 : 0.45,
                    cursor: canAdvance ? "pointer" : "default",
                  }}
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canAdvance}
                  className="rounded-full px-6 py-2.5 text-sm font-bold text-white transition-all active:scale-95"
                  style={{
                    background: canAdvance ? CORAL : "#2a2a2a",
                    opacity: canAdvance ? 1 : 0.45,
                    cursor: canAdvance ? "pointer" : "default",
                  }}
                >
                  Enviar →
                </button>
              )}
            </div>
          </div>
          <p className="mt-3 text-center text-xs" style={{ color: "#555" }}>
            Sin spam. Solo te contactamos para enviarte tu propuesta.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function TrustSignals() {
  const items = [
    "Cobertura nacional",
    "Activación en 48 hrs",
    "Sin permanencia",
  ] as const;

  return (
    <section className="px-5 py-6" style={{ background: "#f7f7f7", borderTop: "1px solid #ececec" }}>
      <div className="mx-auto flex max-w-lg flex-wrap justify-center gap-x-6 gap-y-2">
        {items.map((item) => (
          <span key={item} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#555" }}>
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: CORAL }} />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
function PageFooter() {
  return (
    <footer className="px-5 py-8 text-center" style={{ background: BG_DARK, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <p className="text-sm font-black text-white">MediPass</p>
      <p className="mt-2 text-xs leading-relaxed" style={{ color: "#555" }}>
        Los servicios se brindan a través de proveedores en convenio. © 2026 MediPass
      </p>
    </footer>
  );
}
