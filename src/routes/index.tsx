import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Reveal } from "@/components/medipass/Reveal";
import { submitLeadFn, mapSalud } from "@/lib/actions/submitLead";
import {
  CALENDLY_URL,
  HERO,
  ATTENTION_BAR,
  VSL,
  NEXT_STEP_BRIDGE,
  CALL_EXPECTATIONS as CALL_EXPECTATIONS_CONTENT,
  TRUST_SIGNALS,
  FAQS as FAQS_CONTENT,
} from "@/lib/content";

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
const FAQ_BG = "#DBECEB";
const FAQ_TITLE = "#1B5157";
const FAQ_TEXT = "#3d6b70";

type QuizAnswers = {
  colaboradores: string;
  rol: string;
  salud: string;
  empresa: string;
  nombre: string;
  correo: string;
  whatsapp: string;
};

const QUIZ_STEPS = [
  {
    key: "colaboradores" as const,
    question: "¿Cuántos colaboradores tiene tu empresa?",
    options: ["1 – 50", "50 – 150", "150 – 250", "250+"] as const,
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


const CALL_EXPECTATIONS = CALL_EXPECTATIONS_CONTENT;

function MediPassLanding() {
  const [submitted, setSubmitted] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [leadData, setLeadData] = useState<{ nombre: string; correo: string } | null>(null);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.event === "calendly.event_scheduled") {
        // Derivamos el eventID del URI del evento de Calendly para poder deduplicar con CAPI
        const eventUri: string | undefined = e.data?.payload?.event?.uri;
        const eventID = eventUri
          ? `sched_${eventUri.split("/").pop()}`
          : `sched_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq("track", "Schedule", {}, { eventID });
        }

        setTimeout(() => {
          setScheduled(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 10000);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const view = scheduled ? "scheduled" : submitted ? "thankyou" : "form";

  return (
    <div id="top" className="min-h-screen" style={{ background: BG_DARK }}>
      <main>
        {view === "scheduled" ? (
          <ScheduledConfirmation />
        ) : view === "thankyou" ? (
          <ThankYou leadData={leadData} />
        ) : (
          <>
            <HeroSection />
            <PuenteSiguientePaso />
            {/* TODO: tracking — evento "quiz_start" al renderizar el primer paso */}
            <QuizSection
              onSubmit={(data) => {
                setLeadData(data);
                setSubmitted(true);
              }}
            />
            <FaqSection />
            <TrustSignalsSection />
          </>
        )}
      </main>
      <PageFooter />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="px-5 pb-8 pt-10 text-center" style={{ background: BG_DARK }}>
      <div className="mx-auto max-w-xl">
        <Reveal delay={80}>
          <h1
            className="font-black leading-tight tracking-tight text-white"
            style={{ fontSize: "clamp(26px, 7vw, 40px)" }}
          >
            {HERO.headlinePart1}
            <span style={{ color: CORAL }}>{HERO.headlineAccent}</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
            {HERO.subheadline}
          </p>
        </Reveal>

        <Reveal delay={240}>
          <BarraAtencion />
        </Reveal>

        <Reveal delay={320}>
          <HeroVideo />
        </Reveal>
      </div>
    </section>
  );
}

function BarraAtencion() {
  return (
    <div
      className="mx-auto mt-7 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5"
      style={{ background: CORAL }}
    >
      <span className="text-xs font-black uppercase tracking-wider text-white">
        ▶ {ATTENTION_BAR.text}
      </span>
    </div>
  );
}

function HeroVideo({ disclaimer }: { disclaimer?: string }) {
  return (
    <div className="mx-auto mt-3">
      <div
        className="relative w-full overflow-hidden rounded-xl"
        style={{ aspectRatio: "16/9", border: `1px solid ${VSL_BORDER}` }}
      >
        <iframe
          src="https://www.youtube.com/embed/dDkPlIWy11I?rel=0&modestbranding=1&autoplay=1&mute=1"
          title="MediPass — Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          style={{ border: 0 }}
        />
      </div>
      {disclaimer && (
        <p className="mt-2 text-xs" style={{ color: "#555" }}>
          ⏱ {disclaimer}
        </p>
      )}
    </div>
  );
}

function PuenteSiguientePaso() {
  return (
    <section className="px-5 pb-2 pt-8 text-center" style={{ background: BG_DARK }}>
      <div className="mx-auto max-w-lg">
        <Reveal>
          <p
            className="font-bold leading-snug text-white"
            style={{ fontSize: "clamp(16px, 4vw, 20px)" }}
          >
            <span
              style={{
                color: CORAL,
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                textDecorationThickness: "2px",
              }}
            >
              {NEXT_STEP_BRIDGE.labelAccent}
            </span>{" "}
            {NEXT_STEP_BRIDGE.text}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ScheduledConfirmation() {
  return (
    <section className="px-5 pb-8 pt-10 text-center" style={{ background: BG_DARK }}>
      <div className="mx-auto max-w-xl">
        <Reveal>
          <div className="mb-4 text-5xl" aria-hidden="true">🙌</div>
        </Reveal>
        <Reveal delay={80}>
          <h1
            className="font-black leading-tight tracking-tight text-white"
            style={{ fontSize: "clamp(26px, 7vw, 40px)" }}
          >
            ¡Gracias por agendar{" "}
            <span style={{ color: CORAL }}>tu llamada!</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
            En breve recibirás una invitación en tu correo con todos los detalles.
            Nuestro equipo estará listo para atenderte puntualmente.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div
            className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
            style={{ background: CORAL, color: "white" }}
          >
            Cita confirmada
          </div>
        </Reveal>

        <Reveal delay={320}>
          <p className="mx-auto mt-8 max-w-sm text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
            Mientras tanto, mira este video para que llegues preparado a la llamada.
          </p>
        </Reveal>

        <Reveal delay={400}>
          <HeroVideo disclaimer={VSL.disclaimerScheduled} />
        </Reveal>
      </div>
    </section>
  );
}

function ThankYou({ leadData }: { leadData: { nombre: string; correo: string } | null }) {
  const [checked, setChecked] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const calendlyUrl = (() => {
    try {
      const base = new URL(CALENDLY_URL);
      if (leadData?.nombre) base.searchParams.set("name", leadData.nombre);
      if (leadData?.correo) base.searchParams.set("email", leadData.correo);
      return base.toString();
    } catch {
      return CALENDLY_URL;
    }
  })();

  useEffect(() => {
    if (!showCalendar) return;
    if (!document.querySelector('script[src*="assets.calendly.com"]')) {
      const s = document.createElement("script");
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.async = true;
      document.head.appendChild(s);
    }
    setTimeout(() => {
      calendarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }, [showCalendar]);

  return (
    <section className="px-5 py-12" style={{ background: BG_DARK }}>
      <div className="mx-auto max-w-lg text-center">
        <Reveal delay={80}>
          <h2
            className="font-black leading-tight text-white"
            style={{ fontSize: "clamp(22px, 5vw, 28px)" }}
          >
            ¡Ya casi terminas{leadData?.nombre ? `, ${leadData.nombre.split(" ")[0]}` : ""}!
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
            El siguiente paso es agendar una sesión de diagnóstico sin costo.
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
              📅 Llamada · Gratis · Sin compromiso
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
              Confirmo que puedo tomar o proponer decisiones de beneficios en mi empresa.
            </span>
          </label>
        </Reveal>

        {/* Botón Calendly — deshabilitado hasta que el checkbox esté palomeado */}
        <Reveal delay={380}>
          {checked ? (
            <button
              type="button"
              onClick={() => setShowCalendar(true)}
              className="mt-4 block w-full rounded-full py-4 text-center text-base font-black text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(234,107,72,0.35)]"
              style={{ background: CORAL }}
            >
              Agendar mi llamada →
            </button>
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

        {showCalendar && (
          <>
            <style>{`.mp-calendly{height:700px}@media(max-width:639px){.mp-calendly{height:1000px}}`}</style>
            <div ref={calendarRef} className="mt-6 overflow-hidden rounded-xl">
              <div
                className="calendly-inline-widget mp-calendly w-full"
                data-url={calendlyUrl}
                style={{ minWidth: "320px" }}
              />
            </div>
          </>
        )}

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
function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-5 py-12" style={{ background: FAQ_BG }}>
      <div className="mx-auto max-w-lg">
        <Reveal>
          <h2
            className="mb-8 font-black tracking-tight"
            style={{ fontSize: "clamp(22px, 5vw, 28px)", color: FAQ_TITLE }}
          >
            Preguntas frecuentes
          </h2>
        </Reveal>

        <div className="space-y-2">
          {FAQS_CONTENT.map((faq, i) => (
            <Reveal key={i} delay={i * 60}>
              <div
                className="overflow-hidden rounded-xl"
                style={{ border: "1px solid rgba(27,81,87,0.15)" }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors"
                  style={{
                    background: open === i ? "rgba(234,107,72,0.07)" : "rgba(255,255,255,0.7)",
                  }}
                >
                  <span className="pr-4 text-sm font-semibold" style={{ color: FAQ_TITLE }}>{faq.q}</span>
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
                    style={{ color: FAQ_TEXT, background: "rgba(255,255,255,0.5)" }}
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
    { key: "empresa" as const, placeholder: "Nombre de tu empresa", type: "text" },
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

function QuizSection({ onSubmit }: { onSubmit: (data: { nombre: string; correo: string }) => void }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    colaboradores: "",
    rol: "",
    salud: "",
    empresa: "",
    nombre: "",
    correo: "",
    whatsapp: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof QuizAnswers, string>>>({});

  const TOTAL_STEPS = 4;
  const isSelectionStep = step < 3;
  const currentConfig = isSelectionStep ? QUIZ_STEPS[step as 0 | 1 | 2] : null;
  const currentValue = isSelectionStep ? answers[QUIZ_STEPS[step as 0 | 1 | 2].key] : "";

  const canAdvance =
    !isSubmitting &&
    (isSelectionStep
      ? !!currentValue
      : answers.empresa.trim().length >= 1 &&
        answers.nombre.trim().length >= 2 &&
        /\S+@\S+\.\S+/.test(answers.correo) &&
        answers.whatsapp.trim().length >= 10);

  const goNext = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    const newErrors: Partial<Record<keyof QuizAnswers, string>> = {};
    if (!answers.empresa.trim()) newErrors.empresa = "Escribe el nombre de tu empresa";
    if (answers.nombre.trim().length < 2) newErrors.nombre = "Escribe tu nombre";
    if (!/\S+@\S+\.\S+/.test(answers.correo)) newErrors.correo = "Escribe un correo válido";
    if (answers.whatsapp.trim().length < 10) newErrors.whatsapp = "Escribe tu número de WhatsApp";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const eventID = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

      await submitLeadFn({
        data: {
          empresa: answers.empresa.trim(),
          contacto: answers.nombre.trim() || undefined,
          puesto: answers.rol || undefined,
          correo: answers.correo.trim(),
          whatsapp: answers.whatsapp.trim() || undefined,
          colaboradores: answers.colaboradores || undefined,
          seguroActual: mapSalud(answers.salud),
          eventID,
        },
      });

      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {}, { eventID });
      }
      onSubmit({ nombre: answers.nombre.trim(), correo: answers.correo.trim() });
    } catch {
      toast.error("No pudimos guardar tus datos, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideClass = direction === 1 ? "quiz-slide-right" : "quiz-slide-left";

  return (
    <section id="formulario" className="px-5 pb-10 pt-0" style={{ background: BG_DARK }}>
      <div className="mx-auto max-w-lg">
        <Reveal>
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
                  disabled={!canAdvance || isSubmitting}
                  className="rounded-full px-6 py-2.5 text-sm font-bold text-white transition-all active:scale-95"
                  style={{
                    background: canAdvance && !isSubmitting ? CORAL : "#2a2a2a",
                    opacity: canAdvance && !isSubmitting ? 1 : 0.45,
                    cursor: canAdvance && !isSubmitting ? "pointer" : "default",
                  }}
                >
                  {isSubmitting ? "Enviando…" : "Enviar →"}
                </button>
              )}
            </div>
          </div>
          <p className="mt-3 text-center text-xs" style={{ color: TEXT_MUTED }}>
            {HERO.formDisclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function TrustSignalsSection() {
  return (
    <section className="px-5 py-6" style={{ background: "#f7f7f7", borderTop: "1px solid #ececec" }}>
      <div className="mx-auto flex max-w-lg flex-wrap justify-center gap-x-6 gap-y-2">
        {TRUST_SIGNALS.map((item) => (
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
