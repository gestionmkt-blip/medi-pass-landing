import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/medipass/Reveal";

export const Route = createFileRoute("/")({
  component: MediPassLanding,
  head: () => ({
    meta: [
      { title: "MediPass — Respaldo de salud para tu equipo" },
      { name: "description", content: "Membresía de salud para empresas en Mérida y todo México. Orientación médica 24/7, videoconsultas y médico a domicilio desde menos de $30 al mes por persona." },
    ],
  }),
});

const CORAL = "#EA6B48";
const TEAL = "#000000";
const INK = "#1a1a1a";
const INK_SOFT = "#444444";
const LINE = "#e8e8e8";
const BLUE = "#B1D6FB";
const LAVENDER = "#D3ACE5";
const YELLOW = "#E5CF5A";

const WHATSAPP_NUMBER = "5219999999999";
const WA_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola MediPass, me gustaría una cotización para mi empresa.")}`;

const H2_STYLE: React.CSSProperties = {
  color: TEAL,
  fontSize: "clamp(30px, 5.2vw, 64px)",
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
};

const HL: React.CSSProperties = { color: CORAL };

function SectionLabel({ number, children }: { number?: string; children: React.ReactNode }) {
  return (
    <div
      className="mb-6 inline-flex items-center gap-3"
      style={{ color: TEAL, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}
    >
      {number && <span>{number}</span>}
      <span style={{ width: 24, height: 1, background: CORAL }} />
      <span>{children}</span>
    </div>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className="fixed left-0 right-0 top-0 z-40 bg-white transition-shadow"
      style={{ boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.04), 0 8px 24px -16px rgba(0,0,0,0.12)" : "none" }}
    >
      <div className="mx-auto flex h-[60px] max-w-[1100px] items-center justify-between px-6 md:h-[72px]">
        <a href="#top" aria-label="MediPass — Inicio">
          <img src={`${import.meta.env.BASE_URL}medipass-logo.png`} alt="MediPass" className="w-auto" style={{ height: 32 }} />
        </a>
        <button
          onClick={() => document.getElementById('cotizar')?.scrollIntoView({ behavior: 'smooth' })}
          className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95"
          style={{ background: CORAL }}
        >
          Cotizar
        </button>
      </div>
    </header>
  );
}

function WhatsAppFloat() {
  return (
    <a
      href={WA_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed z-50 flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
      style={{ bottom: 24, right: 20, width: 56, height: 56, background: CORAL }}
    >
      <MessageCircle size={26} color="white" strokeWidth={2.2} />
    </a>
  );
}

function Hero() {
  return (
    <section id="top" className="px-6 pb-[80px] pt-[120px] md:pt-[160px]">
      <div className="mx-auto max-w-[1100px]">
        <Reveal>
          <span
            className="inline-block rounded-full px-3 py-1"
            style={{ background: BLUE, color: TEAL, fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}
          >
            Para empresas
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1
            className="mt-8 font-extrabold tracking-tight"
            style={{ color: TEAL, fontSize: "clamp(38px, 7vw, 80px)", lineHeight: 1.08, letterSpacing: "-0.02em" }}
          >
            Tu equipo con <span style={HL}>respaldo de salud</span>.
            <br className="hidden md:block" /> Sin los costos de un seguro.
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-8 max-w-[720px]" style={{ color: INK_SOFT, fontSize: 18, lineHeight: 1.7 }}>
            Cuando alguien de tu equipo se enferma, no tienes que improvisar. MediPass da a tus colaboradores orientación médica 24/7, videoconsultas y médico a domicilio — desde menos de $30 al mes por persona.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6">
            <button
              onClick={() => document.getElementById('cotizar')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex w-full items-center justify-center rounded-full px-7 text-base font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 active:scale-95 md:w-auto"
              style={{ background: CORAL, height: 56 }}
            >
              Quiero mi cotización gratuita
            </button>
            <a href="#planes" className="text-base font-semibold underline-offset-4 hover:underline" style={{ color: TEAL }}>
              Ver planes →
            </a>
          </div>
        </Reveal>
        <Reveal delay={320}>
          <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm" style={{ color: INK_SOFT }}>
            <Badge>Cobertura nacional</Badge>
            <Badge>Activación en 24 hrs</Badge>
            <Badge>Sin permanencia forzada</Badge>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span style={{ width: 6, height: 6, borderRadius: 999, background: CORAL, display: "inline-block" }} />
      {children}
    </span>
  );
}

function Authority() {
  const metrics = [
    { value: "15", suffix: "+", label: "años ayudando a empresas" },
    { value: "1,000", suffix: "+", label: "colaboradores respaldados" },
    { value: "48 hrs", suffix: "", label: "para activar tu equipo" },
    { value: "Nacional", suffix: "", label: "cobertura en México" },
  ];

  return (
    <section className="px-6 pb-[80px] pt-[40px] md:pb-[120px] md:pt-[60px]">
      <div className="mx-auto max-w-[1100px]">
        <Reveal>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-0">
            {metrics.map((m, i) => (
              <div
                key={m.label}
                className="flex flex-col items-center text-center md:px-6"
                style={{
                  borderRight: i < metrics.length - 1 ? `1px solid ${LINE}` : undefined,
                }}
              >
                <div className="font-extrabold tracking-tight" style={{ color: TEAL, fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {m.value}
                  {m.suffix && <span style={{ color: CORAL }}>{m.suffix}</span>}
                </div>
                <p className="mt-3 text-sm font-medium uppercase tracking-widest" style={{ color: INK_SOFT, letterSpacing: "0.12em" }}>
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="mx-auto mt-14 max-w-[820px] text-center md:mt-16">
            <p style={{ color: INK_SOFT, fontSize: 17, lineHeight: 1.7 }}>
              Una red de bienestar y salud pensada para que tus colaboradores y sus familias tengan respaldo cuando más lo necesitan.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Problem() {
  const bullets = [
    "Un colaborador que no sabe a dónde acudir falta más tiempo del necesario",
    "Tú terminas resolviendo situaciones de salud que no deberían llegar a tu escritorio",
    "Un seguro médico corporativo cuesta 10 veces más — y la mayoría de las PyMEs no puede pagarlo",
  ];
  return (
    <section className="px-6 py-[80px] md:py-[120px]">
      <div className="mx-auto max-w-[1100px]">
        <Reveal><SectionLabel number="01">El problema</SectionLabel></Reveal>
        <Reveal delay={80}>
          <h2 className="font-extrabold tracking-tight" style={H2_STYLE}>
            Sin respaldo, una urgencia menor se convierte en <span style={HL}>días perdidos</span>.
          </h2>
        </Reveal>

        <ul className="mt-14 space-y-8 md:space-y-10">
          {bullets.map((b, i) => (
            <Reveal key={i} delay={i * 80}>
              <li className="flex items-start gap-5">
                <span className="font-mono" style={{ color: CORAL, fontSize: 14, marginTop: 6, letterSpacing: "0.1em" }}>—</span>
                <p style={{ color: INK, fontSize: 19, lineHeight: 1.6, fontWeight: 500 }} className="max-w-[820px]">
                  {b}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={300}>
          <div className="mt-16 pl-6 md:pl-8" style={{ borderLeft: `3px solid ${TEAL}` }}>
            <p style={{ color: TEAL, fontSize: "clamp(20px, 2.4vw, 24px)", lineHeight: 1.5, fontWeight: 500 }}>
              MediPass no es un seguro. Es el respaldo cotidiano que tu equipo necesita para resolver sin improvisar — al precio que tu empresa puede pagar hoy.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function WhatIs() {
  const benefits = [
    "Orientación médica 24/7",
    "Videoconsultas: médica, nutricional y psicológica",
    "Médico a domicilio",
    "Limpieza dental incluida",
    "Ambulancia terrestre",
    "Descuentos en medicamentos y hospitales",
    "Certificado de accidentes personales",
    "Cobertura familiar disponible",
  ];
  return (
    <section className="px-6 py-[80px] md:py-[120px]">
      <div className="mx-auto max-w-[1100px]">
        <Reveal><SectionLabel number="02">Qué es</SectionLabel></Reveal>
        <Reveal delay={80}>
          <h2 className="font-extrabold tracking-tight" style={H2_STYLE}>
            Tus colaboradores con una <span style={HL}>ruta clara</span> cuando algo pasa.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-8 max-w-[820px]" style={{ color: INK_SOFT, fontSize: 18, lineHeight: 1.7 }}>
            En lugar de buscar en Google o esperar a que el problema se agrave, tu equipo tiene acceso inmediato a orientación médica, nutricional y emocional — más médico a domicilio, videoconsultas y descuentos en medicamentos y hospitales. Todo en una membresía anual.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

type BenefitGroup = {
  title: string;
  items: string[];
};

type Plan = {
  name: string;
  price: string;
  description: string;
  accent: string;
  badge?: string;
  badgeColor?: string;
  highlights: string[];
  benefitGroups: BenefitGroup[];
};

function PlanCard({ plan }: { plan: Plan }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative rounded-2xl bg-white p-8 md:p-10"
      style={{ border: `1px solid ${LINE}`, borderLeft: `4px solid ${plan.accent}` }}
    >
      {plan.badge && (
        <span
          className="absolute -top-3 left-8 rounded-full px-3 py-1 text-xs font-semibold text-white"
          style={{ background: plan.badgeColor ?? TEAL, letterSpacing: "0.04em" }}
        >
          {plan.badge}
        </span>
      )}
      <h3 className="font-extrabold tracking-tight" style={{ color: TEAL, fontSize: 26, letterSpacing: "-0.01em" }}>
        {plan.name}
      </h3>
      <p className="mt-4 font-semibold" style={{ color: INK, fontSize: 20, lineHeight: 1.4 }}>{plan.price}</p>
      <p className="mt-4" style={{ color: INK_SOFT, fontSize: 16, lineHeight: 1.65 }}>{plan.description}</p>

      <ul className="mt-5 space-y-2">
        {plan.highlights.map((h) => (
          <li key={h} className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full" style={{ background: BLUE }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </span>
            <span style={{ color: INK, fontSize: 15, lineHeight: 1.5 }}>{h}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setOpen(!open)}
        className="mt-6 flex items-center gap-2 text-sm font-semibold"
        style={{ color: CORAL }}
        aria-expanded={open}
      >
        Ver beneficios incluidos
        <ChevronDown size={16} className="transition-transform" style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }} />
      </button>

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? 1400 : 0, opacity: open ? 1 : 0 }}
      >
        <div className="mt-5 space-y-5" style={{ borderTop: `1px solid ${LINE}`, paddingTop: 20 }}>
          {plan.benefitGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: TEAL, letterSpacing: "0.1em" }}>{group.title}</p>
              <ul className="space-y-1.5">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ color: CORAL, fontSize: 13, marginTop: 3, flexShrink: 0 }}>—</span>
                    <span style={{ color: INK_SOFT, fontSize: 14, lineHeight: 1.55 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Plans() {
  const plans: Plan[] = [
    {
      name: "Plus Individual",
      price: "$450 MXN / año por persona",
      description: "Ideal para dar respaldo básico de salud al colaborador.",
      accent: CORAL,
      highlights: [
        "Orientación médica 24/7",
        "Médico a domicilio y ambulancia",
        "Descuentos en medicamentos, hospitales y laboratorios",
      ],
      benefitGroups: [
        {
          title: "Atención médica",
          items: [
            "Orientación médica telefónica sin límite de eventos",
            "Médico general a domicilio: 1 evento sin costo",
            "Ambulancia terrestre por emergencia: 1 evento sin costo",
            "Descuentos con médicos generales y especialistas",
          ],
        },
        {
          title: "Bienestar",
          items: [
            "Orientación nutricional telefónica",
            "Contención emocional telefónica 24 hrs",
          ],
        },
        {
          title: "Ahorro en salud",
          items: [
            "Descuentos en medicamentos del 5% al 10%",
            "Descuentos en hospitales del 15% al 20%",
            "Descuentos en laboratorios del 5% al 40%",
            "Servicios dentales con descuentos o precios preferenciales",
            "Enfermera a domicilio con costo preferencial",
          ],
        },
      ],
    },
    {
      name: "Plus Familiar",
      price: "$870 MXN / año",
      description: "Para extender el respaldo al titular y hasta 5 beneficiarios.",
      accent: YELLOW,
      highlights: [
        "Titular + hasta 5 beneficiarios",
        "2 eventos de médico a domicilio",
        "2 eventos de ambulancia terrestre",
      ],
      benefitGroups: [
        {
          title: "Atención médica",
          items: [
            "Orientación médica telefónica sin límite de eventos",
            "Médico general a domicilio: 2 eventos sin costo",
            "Ambulancia terrestre por emergencia: 2 eventos sin costo",
            "Consultas con médicos generales y especialistas",
          ],
        },
        {
          title: "Bienestar",
          items: [
            "Orientación nutricional telefónica",
            "Contención emocional telefónica 24 hrs",
          ],
        },
        {
          title: "Ahorro en salud",
          items: [
            "Descuentos en medicamentos del 5% al 10%",
            "Descuentos en hospitales del 15% al 20%",
            "Descuentos en laboratorios del 5% al 40%",
            "Servicios dentales con descuentos o precios preferenciales",
            "Enfermera a domicilio con costo preferencial",
          ],
        },
      ],
    },
    {
      name: "Pro Individual",
      price: "$890 MXN / año por persona",
      description: "Para colaboradores que quieres respaldar con una membresía más completa.",
      accent: TEAL,
      badge: "⭐ Más popular",
      badgeColor: "#E8532A",
      highlights: [
        "Orientación médica y videoconsulta",
        "Limpieza dental y check up",
        "Certificado de accidentes personales",
      ],
      benefitGroups: [
        {
          title: "Atención médica",
          items: [
            "Orientación médica telefónica sin límite de eventos",
            "Videoconsulta médica",
            "Médico general a domicilio: 1 evento sin costo",
            "Ambulancia terrestre por emergencia: 2 eventos sin costo",
            "Consultas con médicos generales y especialistas",
          ],
        },
        {
          title: "Bienestar",
          items: [
            "Orientación nutricional telefónica y por videoconsulta",
            "Contención emocional telefónica y por videoconsulta",
            "Fisioterapia: 1 evento sin costo, exclusivo en Mérida, Yucatán",
          ],
        },
        {
          title: "Ahorro en salud",
          items: [
            "Descuentos en medicamentos",
            "Descuentos en hospitales del 15% al 20%",
            "Descuentos en laboratorios del 5% al 40%",
            "Un check up a elegir sin costo",
            "Limpieza dental sin costo",
            "30% de reintegro en medicamentos recetados por médicos CADI, sujeto a condiciones aplicables",
          ],
        },
        {
          title: "Protección adicional",
          items: [
            "Certificado de accidentes personales para el titular",
            "Asistencia funeraria",
            "Folio de cine 2x1 cada 15 días",
            "Descuentos comerciales del 10% al 50% en establecimientos participantes",
          ],
        },
      ],
    },
    {
      name: "Pro Familiar",
      price: "$1,760 MXN / año",
      description: "La opción más completa para titular y familia.",
      accent: LAVENDER,
      badge: "Mayor respaldo familiar",
      highlights: [
        "Titular + hasta 5 beneficiarios",
        "3 eventos de médico a domicilio",
        "5 eventos de ambulancia terrestre",
      ],
      benefitGroups: [
        {
          title: "Atención médica",
          items: [
            "Orientación médica telefónica y videoconsulta",
            "Médico general a domicilio: 3 eventos sin costo",
            "Ambulancia terrestre por emergencia: 5 eventos sin costo",
            "Consultas con médicos generales y especialistas",
          ],
        },
        {
          title: "Bienestar",
          items: [
            "Orientación nutricional telefónica y por videoconsulta",
            "Contención emocional telefónica y por videoconsulta",
            "Fisioterapia: 1 evento sin costo, exclusivo en Mérida, Yucatán",
          ],
        },
        {
          title: "Ahorro en salud",
          items: [
            "Descuentos en medicamentos",
            "Descuentos en hospitales del 15% al 20%",
            "Descuentos en laboratorios del 5% al 40%",
            "Un check up a elegir",
            "3 limpiezas dentales sin costo",
            "30% de reintegro en medicamentos recetados por médicos CADI, sujeto a condiciones aplicables",
          ],
        },
        {
          title: "Protección adicional",
          items: [
            "Asistencia funeraria: 1 servicio titular + 3 servicios beneficiarios",
            "Certificado de accidentes personales solo para el titular",
            "Posibilidad de agregar certificado de accidentes personales a un beneficiario por $100 MXN + IVA",
            "3 folios de cine 2x1 cada 15 días",
            "Descuentos comerciales del 10% al 50% en establecimientos participantes",
          ],
        },
      ],
    },
  ];

  return (
    <section id="planes" className="px-6 py-[80px] md:py-[120px]">
      <div className="mx-auto max-w-[1100px]">
        <Reveal><SectionLabel number="03">Membresías</SectionLabel></Reveal>
        <Reveal delay={80}>
          <h2 className="font-extrabold tracking-tight" style={H2_STYLE}>
            Elige la membresía que quieres ofrecer a tu equipo.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-[820px]" style={{ color: INK_SOFT, fontSize: 18, lineHeight: 1.7 }}>
            Puedes contratar membresías individuales o familiares para tus colaboradores. A partir de 10 colaboradores, podemos revisar un precio preferencial por volumen.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-3 text-sm" style={{ color: "#777" }}>
            Precios base anuales con IVA incluido. Cotiza precio preferencial para empresas desde 10 colaboradores.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 80}>
              <PlanCard plan={p} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <div
            className="mt-14 rounded-2xl p-8 md:p-10"
            style={{ background: "rgba(27,81,87,0.05)", border: "1px solid rgba(27,81,87,0.18)" }}
          >
            <h3 className="font-extrabold tracking-tight" style={{ color: TEAL, fontSize: "clamp(22px, 2.8vw, 28px)", letterSpacing: "-0.01em" }}>
              ¿Tienes 10 o más colaboradores?
            </h3>
            <p className="mt-4 max-w-[680px]" style={{ color: INK_SOFT, fontSize: 17, lineHeight: 1.7 }}>
              Podemos armarte una propuesta con precio preferencial según el número de personas, modalidad elegida y alcance que quieras ofrecer: individual o familiar.
            </p>
            <a
              href="#cotizar"
              className="mt-6 inline-flex items-center justify-center rounded-full px-7 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-95"
              style={{ background: CORAL, height: 52 }}
            >
              Cotizar precio para mi empresa
            </a>
            <p className="mt-8 text-xs" style={{ color: "#999", lineHeight: 1.6 }}>
              Los precios mostrados son precios base anuales con IVA incluido. Los beneficios están sujetos a condiciones, disponibilidad, ciudad, proveedores en convenio y plan contratado. MediPass no es una aseguradora.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function WhatChanges() {
  const blocks = [
    { headline: "Menos ausencias", body: "Una orientación médica a tiempo evita que una molestia menor se convierta en días de baja." },
    { headline: "Decisiones más rápidas", body: "Tu equipo sabe a dónde acudir. Tú dejas de ser el intermediario de sus problemas de salud." },
    { headline: "Desde $30 al mes", body: "Por persona. Sin los costos ni la burocracia de un seguro médico corporativo.", highlightFirst: true },
  ];
  return (
    <section className="px-6 py-[80px] md:py-[120px]">
      <div className="mx-auto max-w-[1100px]">
        <Reveal><SectionLabel number="04">Lo que cambia</SectionLabel></Reveal>
        <Reveal delay={80}>
          <h2 className="font-extrabold tracking-tight" style={H2_STYLE}>
            Lo que pasa cuando tu equipo tiene respaldo.
          </h2>
        </Reveal>
        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
          {blocks.map((b, i) => (
            <Reveal key={i} delay={i * 100}>
              <div>
                <h3
                  className="font-extrabold tracking-tight"
                  style={{ color: b.highlightFirst ? CORAL : TEAL, fontSize: "clamp(28px, 3.4vw, 36px)", letterSpacing: "-0.02em" }}
                >
                  {b.headline}
                </h3>
                <div style={{ width: 40, height: 2, background: CORAL, marginTop: 16, marginBottom: 20 }} />
                <p style={{ color: INK_SOFT, fontSize: 17, lineHeight: 1.65 }}>{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { n: "01", title: "Solicitas tu cotización", text: "Cuéntanos cuántos colaboradores tienes. Te armamos una propuesta en menos de 24 horas." },
    { n: "02", title: "Revisamos juntos tu propuesta", text: "Un asesor te explica qué plan se ajusta mejor a tu empresa y responde todas tus dudas." },
    { n: "03", title: "Tu equipo activa su membresía", text: "Activación inmediata. Sin trámites complicados. Sin esperar semanas." },
  ];
  return (
    <section className="px-6 py-[80px] md:py-[120px]">
      <div className="mx-auto max-w-[1100px]">
        <Reveal><SectionLabel number="05">El proceso</SectionLabel></Reveal>
        <Reveal delay={80}>
          <h2 className="font-extrabold tracking-tight" style={H2_STYLE}>
            Tres pasos para tener a tu equipo respaldado.
          </h2>
        </Reveal>

        <div className="relative mt-14">
          <div className="absolute left-[14px] top-2 bottom-2 w-px md:hidden" style={{ background: LINE }} />
          <ol className="space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-10">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <li className="relative pl-12 md:pl-0">
                  <div
                    className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full font-mono md:static md:mb-6"
                    style={{ background: CORAL, color: "white", fontSize: 13, fontWeight: 700 }}
                  >
                    {s.n}
                  </div>
                  <h3 className="font-extrabold tracking-tight" style={{ color: TEAL, fontSize: "clamp(22px, 2.6vw, 28px)", letterSpacing: "-0.01em" }}>
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-[340px]" style={{ color: INK_SOFT, fontSize: 17, lineHeight: 1.65 }}>
                    {s.text}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function LeadForm() {
  return (
    <section id="cotizar" className="px-6 py-[80px] md:py-[120px]">
      <div className="mx-auto max-w-[820px]">
        <Reveal><SectionLabel number="06">Cotiza</SectionLabel></Reveal>
        <Reveal delay={80}>
          <h2 className="font-extrabold tracking-tight" style={H2_STYLE}>
            Tu equipo puede tener respaldo de salud <span style={HL}>esta semana</span>.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6" style={{ color: INK_SOFT, fontSize: 18, lineHeight: 1.7 }}>
            Déjanos tus datos y un asesor te contacta en menos de 24 horas. Solo para darte tu cotización — sin compromisos.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-12 flex flex-col gap-4">
            <p style={{ color: INK_SOFT, fontSize: 15, lineHeight: 1.65 }}>
              Agenda una llamada de 20 minutos con un asesor. Sin compromiso —
              solo para entender qué necesita tu empresa y armarte una propuesta.
            </p>
            <a
              href="TU_LINK_DE_CALENDLY_AQUI"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full px-6 font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-95"
              style={{ background: CORAL, height: 56, fontSize: 18 }}
            >
              Agendar llamada gratuita
            </a>
            <p className="text-center text-xs" style={{ color: "#777", lineHeight: 1.5 }}>
              MediPass no es una aseguradora. Los servicios se brindan a través de proveedores en convenio.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      quote: "Desde que tenemos MediPass, nuestros colaboradores ya no faltan días completos por algo menor. La orientación 24/7 les da certeza.",
      name: "[Nombre]",
      role: "Director de RRHH",
      company: "[Empresa]",
    },
    {
      quote: "Lo que más valoro es que no es un seguro complicado. Se activó en 2 días y mis empleados lo usan de verdad.",
      name: "[Nombre]",
      role: "CEO",
      company: "[Empresa]",
    },
    {
      quote: "Teníamos mucho ausentismo. Con MediPass bajamos las ausencias sin aumentar el presupuesto de beneficios.",
      name: "[Nombre]",
      role: "Gerente General",
      company: "[Empresa]",
    },
  ];
  return (
    <section className="px-6 py-[80px] md:py-[120px]">
      <div className="mx-auto max-w-[1100px]">
        <Reveal><SectionLabel>Lo que dicen</SectionLabel></Reveal>
        <Reveal delay={80}>
          <h2 className="font-extrabold tracking-tight" style={H2_STYLE}>
            Empresas que ya tienen a su equipo respaldado.
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="rounded-2xl p-5" style={{ border: `1px solid ${LINE}` }}>
                <p className="mb-4" style={{ color: INK, fontSize: 15, lineHeight: 1.65 }}>"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold" style={{ color: TEAL }}>{t.name}</p>
                  <p className="text-xs" style={{ color: INK_SOFT }}>{t.role} · {t.company}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a, open, onClick }: { q: string; a: string; open: boolean; onClick: () => void }) {
  return (
    <div style={{ borderBottom: `1px solid ${LINE}` }}>
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between gap-4 py-6 text-left"
        style={{ minHeight: 56 }}
        aria-expanded={open}
      >
        <span className="font-semibold" style={{ color: TEAL, fontSize: 18, lineHeight: 1.4 }}>{q}</span>
        <ChevronDown size={22} color={CORAL} className="flex-shrink-0 transition-transform" style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }} />
      </button>
      <div className="overflow-hidden transition-all" style={{ maxHeight: open ? 500 : 0, opacity: open ? 1 : 0 }}>
        <p className="pb-6 pr-10" style={{ color: INK_SOFT, fontSize: 17, lineHeight: 1.7 }}>{a}</p>
      </div>
    </div>
  );
}

function FAQ() {
  const items = [
    { q: "¿Es un seguro médico?", a: "No. MediPass es una membresía de salud y beneficios. No reemplaza un seguro de gastos médicos mayores — lo complementa con acceso cotidiano a orientación, consultas y descuentos." },
    { q: "¿Cómo se activa para mis colaboradores?", a: "Una vez que contratas, el proceso de activación es inmediato. Cada colaborador recibe su acceso y puede empezar a usar los beneficios el mismo día." },
    { q: "¿Tiene cobertura en todo México?", a: "Sí, cobertura nacional a través de nuestra red de proveedores en convenio. Algunos servicios presenciales tienen mayor disponibilidad en ciudades principales." },
    { q: "¿Qué pasa si quiero cancelar?", a: "Sin permanencia forzada. Si por cualquier motivo no podemos brindarte un servicio incluido, te reembolsamos el monto correspondiente conforme a nuestros términos y condiciones." },
    { q: "¿Qué pasa si un colaborador deja la empresa?", a: "Puedes dar de baja esa membresía y asignarla a un nuevo colaborador, o simplemente reducir el número de personas en tu siguiente renovación anual." },
    { q: "¿Puedo cambiar el número de colaboradores después de contratar?", a: "Sí. Puedes agregar colaboradores en cualquier momento. Las bajas se aplican en la siguiente renovación anual." },
    { q: "¿Cómo administro el plan para mi equipo?", a: "Te damos acceso a un panel donde puedes ver quiénes están activos, agregar personas y gestionar tu cuenta. Además tienes un asesor asignado para cualquier duda operativa." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-6 py-[80px] md:py-[120px]">
      <div className="mx-auto max-w-[1100px]">
        <Reveal><SectionLabel number="07">Preguntas frecuentes</SectionLabel></Reveal>
        <Reveal delay={80}>
          <h2 className="font-extrabold tracking-tight" style={H2_STYLE}>
            Lo que más nos preguntan.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <div className="mt-12 max-w-[820px]" style={{ borderTop: `1px solid ${LINE}` }}>
            {items.map((it, i) => (
              <FAQItem key={it.q} q={it.q} a={it.a} open={open === i} onClick={() => setOpen(open === i ? null : i)} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 pb-12 pt-[80px]" style={{ borderTop: `1px solid ${LINE}` }}>
      <div className="mx-auto max-w-[1100px] pt-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:items-start">
          <div>
            <div className="font-extrabold tracking-tight" style={{ color: TEAL, fontSize: 26 }}>MediPass</div>
            <p className="mt-2 text-sm" style={{ color: INK_SOFT }}>Contigo en cada paso</p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 md:justify-center">
            <a href="#planes" className="text-sm font-medium hover:underline" style={{ color: INK }}>Membresías</a>
            <a href="#top" className="text-sm font-medium hover:underline" style={{ color: INK }}>Para empresas</a>
            <a href="#cotizar" className="text-sm font-medium hover:underline" style={{ color: INK }}>Contacto</a>
          </nav>
          <div className="md:text-right">
            <a
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors hover:bg-[#EA6B48] hover:text-white"
              style={{ border: `1.5px solid ${CORAL}`, color: CORAL }}
            >
              <MessageCircle size={18} /> Hablar por WhatsApp
            </a>
          </div>
        </div>
        <div className="mt-12 text-xs" style={{ color: "#777", lineHeight: 1.6 }}>
          <p className="max-w-[820px]">
            MediPass no es una aseguradora. Los servicios se brindan a través de proveedores en convenio.
          </p>
          <p className="mt-2">© 2026 MediPass</p>
        </div>
      </div>
    </footer>
  );
}

function MediPassLanding() {
  return (
    <div className="min-h-screen" style={{ color: INK }}>
      <Header />
      <main>
        <Hero />
        <Authority />
        <Problem />
        <WhatIs />
        <div className="px-6 pb-10 flex justify-center">
          <button
            onClick={() => document.getElementById('cotizar')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full max-w-xs rounded-full px-6 font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-95"
            style={{ background: CORAL, height: 56, fontSize: 16 }}
          >
            Quiero mi cotización gratuita
          </button>
        </div>
        <Testimonials />
        <Plans />
        <WhatChanges />
        <Process />
        <LeadForm />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
