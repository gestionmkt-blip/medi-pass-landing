// ── Copy central de la landing ─────────────────────────────────────────────
// Edita aquí para cambiar textos sin tocar la lógica de los componentes.

export const CALENDLY_URL = "https://calendly.com/hola-medipass/45min";

// ── Hero ──────────────────────────────────────────────────────────────────
export const HERO = {
  headlinePart1: "Protege la salud de tu equipo ",
  headlineAccent: "sin pagar un seguro caro",
  subheadline:
    "Mira el video y descubre cómo más de 1,000 colaboradores ya tienen respaldo médico desde $450 al año.",
  formDisclaimer: "Sin spam. Solo te contactamos para enviarte tu propuesta.",
} as const;

// ── Barra de atención (arriba del video) ─────────────────────────────────
export const ATTENTION_BAR = {
  text: "MIRA ESTE VIDEO ANTES DE COTIZAR",
} as const;

// ── Video / VSL ──────────────────────────────────────────────────────────
export const VSL = {
  disclaimer: "Video de 3 minutos — míralo completo antes de cotizar",
  disclaimerScheduled: "Video de 3 minutos — míralo completo antes de tu llamada",
} as const;

// ── Puente "Siguiente paso" (entre video y cuestionario) ─────────────────
export const NEXT_STEP_BRIDGE = {
  labelAccent: "Siguiente paso:",
  text: "responde unas preguntas y arma la propuesta de salud para tu equipo en menos de 30 segundos.",
} as const;

// ── Cómo funciona ─────────────────────────────────────────────────────────
export const HOW_IT_WORKS = {
  eyebrow: "Cómo funciona",
  title: "Todo lo que tu equipo necesita, sin complicaciones",
  intro: "Una membresía de salud práctica y accesible que cubre lo cotidiano — porque la salud no puede esperar.",
  pillars: [
    {
      icon: "🩺",
      title: "Orientación médica 24/7",
      description: "Habla con un médico a cualquier hora, cualquier día.",
      // TODO: reemplazar placeholder por imagen — sugerencia: médico al teléfono de noche, entorno cálido y profesional
    },
    {
      icon: "📱",
      title: "Videoconsultas",
      description: "Consulta desde el celular, sin salir de la oficina.",
      // TODO: imagen sugerida — persona en videollamada médica desde escritorio u oficina
    },
    {
      icon: "🏠",
      title: "Médico a domicilio",
      description: "Cuando hace falta, el médico llega a ti.",
      // TODO: imagen sugerida — médico con maletín llegando a puerta de casa o edificio de oficinas
    },
  ],
} as const;

// ── Formulario ────────────────────────────────────────────────────────────
export type SelectionStepKey = "tipoEmpresa" | "colaboradores" | "rol" | "salud";

export type SelectionStepConfig = {
  key: SelectionStepKey;
  question: string;
  options: readonly string[];
  grid: boolean;
};

export const QUIZ_STEPS: SelectionStepConfig[] = [
  {
    key: "tipoEmpresa",
    question: "¿Qué describe mejor a tu empresa?",
    // TODO: ajustar buckets según los segmentos que más conviertan
    options: [
      "Manufactura, logística o distribución",
      "Servicios profesionales o tecnología",
      "Comercio, restaurantes o retail",
      "Otro tipo de empresa",
    ],
    grid: false,
  },
  {
    key: "colaboradores",
    question: "¿Cuántas personas hay en tu equipo?",
    options: ["1 – 20", "20 – 50", "50 – 150", "150 – 250"],
    grid: true,
  },
  {
    key: "rol",
    question: "¿Cuál es tu rol en la empresa?",
    options: [
      "Dueño / CEO / Director General",
      "Director / Gerente de RRHH",
      "Gerente o Coordinador",
      "Otro — tomo decisiones de beneficios",
    ],
    grid: false,
  },
  {
    key: "salud",
    question: "¿Hoy tienen algún beneficio de salud para su equipo?",
    options: [
      "Sí — seguro médico privado",
      "Sí — solo IMSS / ISSSTE",
      "No tenemos nada",
      "No estoy seguro",
    ],
    grid: false,
  },
];

// ── Prueba social ─────────────────────────────────────────────────────────
export const SOCIAL_PROOF = {
  title: "Empresas que ya cuidan a su equipo con MediPass",
  metrics: [
    // TODO: reemplazar con métricas reales verificadas
    { value: "1,000+", label: "colaboradores activos" },
    { value: "< 5 min", label: "tiempo promedio de respuesta" },
    { value: "48 hrs", label: "activación desde la firma" },
  ],
  testimonials: [
    // TODO: reemplazar con testimoniales reales de directores de RH o dueños de empresa
    {
      quote: "TODO: cita real del director de RH o dueño — impacto en el equipo, facilidad de contratación o ahorro vs seguro.",
      author: "Nombre Apellido",
      role: "Director de RH",
      company: "Nombre de Empresa",
      industry: "Manufactura",
    },
    {
      quote: "TODO: segunda cita real — puede ser de una industria distinta (servicios, comercio, etc.).",
      author: "Nombre Apellido",
      role: "CEO / Dueño",
      company: "Nombre de Empresa",
      industry: "Servicios",
    },
  ],
  // TODO: agregar logos de empresas cliente — { name, src, alt }
  logos: [] as Array<{ name: string; src: string; alt: string }>,
} as const;

// ── ThankYou / Calendly ───────────────────────────────────────────────────
export const CALL_EXPECTATIONS = [
  "Entender el tamaño y necesidades de tu equipo",
  "Explicarte qué plan se adapta mejor a tu empresa",
  "Enviarte una propuesta con precio exacto al terminar",
] as const;

// ── Pie de página ─────────────────────────────────────────────────────────
export const TRUST_SIGNALS = [
  "Cobertura nacional",
  "Activación en 48 hrs",
  "Sin permanencia",
] as const;

// ── FAQs ──────────────────────────────────────────────────────────────────
// Preguntas frecuentes — edita el texto aquí; la estructura del acordeón queda intacta.
export const FAQS = [
  {
    q: "¿MediPass sustituye al IMSS o a un seguro de gastos médicos mayores?",
    a: "No, y no pretende hacerlo. MediPass es una membresía de salud que da a tu equipo acceso inmediato a orientación médica, atención a domicilio y descuentos, todos los días y no solo en emergencias. Funciona perfecto como complemento del IMSS y como la alternativa accesible cuando un seguro de gastos médicos mayores está fuera de presupuesto.",
  },
  {
    q: "¿En qué se diferencia de un seguro de gastos médicos mayores?",
    a: "Un seguro de gastos médicos mayores cubre hospitalizaciones y cirugías grandes, y puede costar más de $15,000 al año por persona. MediPass cubre lo cotidiano —orientación médica 24/7, médico a domicilio, ambulancia, nutrición, apoyo emocional y descuentos— desde menos de $30 al mes por colaborador. No compite con el seguro: lo vuelve costeable dar un beneficio de salud cuando el seguro no lo es.",
  },
  {
    q: "¿Puedo contratarlo aunque mi empresa sea pequeña o mediana?",
    a: "Sí. MediPass está pensado para empresas que quieren dar un beneficio de salud real sin montar una estructura médica interna. El mínimo es de 20 colaboradores.",
  },
  {
    q: "¿Qué incluye la membresía exactamente?",
    a: "Desde el primer día el colaborador tiene sin costo adicional: orientación médica telefónica 24/7, una ambulancia terrestre, una consulta médica a domicilio, orientación nutricional y contención emocional. Otros servicios (consultas subsecuentes, dental, laboratorios) se ofrecen a precio preferencial, muy por debajo del costo particular.",
  },
  {
    q: "¿La orientación médica 24/7 es con médicos reales?",
    a: "Sí. No es un chatbot ni un sistema automático. El colaborador habla directamente con un médico certificado por teléfono o videollamada, cualquier día, a cualquier hora.",
  },
  {
    q: "¿Las videoconsultas están incluidas?",
    a: "Sí. El colaborador puede consultar desde su celular sin salir de casa o de la oficina. No necesita hacer cita con días de anticipación.",
  },
  {
    q: "¿El médico a domicilio tiene costo adicional o va incluido?",
    a: "La primera visita médica a domicilio al año está incluida sin costo. Las subsecuentes tienen un precio muy por debajo del costo particular. La cobertura depende de la zona; lo confirmamos al cotizar.",
  },
  {
    q: "¿Qué tan rápido atienden?",
    a: "La orientación médica telefónica está disponible al instante — sin citas ni tiempos de espera largos. El tiempo de respuesta promedio es de minutos, no horas.",
  },
  {
    q: "¿Cuánto tarda en activarse el beneficio?",
    a: "En cuanto firmamos el acuerdo y procesamos los datos, asignamos las membresías. Los servicios quedan activos en 48 horas. Sin periodos de espera largos.",
  },
  {
    q: "¿Qué pasa si tengo colaboradores en distintas ciudades?",
    a: "La orientación médica, nutricional y emocional es telefónica y funciona en todo el país. Los servicios presenciales —médico a domicilio, ambulancia, dental— dependen de la red disponible en cada zona; lo confirmamos contigo al cotizar.",
  },
  {
    q: "¿Cómo se activa el beneficio para mis colaboradores?",
    a: "Asignamos las membresías y cada colaborador recibe sus datos de acceso. A partir de ahí usa los servicios directamente por app, teléfono o contact center, sin trámites con la empresa de por medio.",
  },
  {
    q: "¿La empresa tiene que gestionar las citas o los servicios?",
    a: "No. El colaborador solicita la atención por su cuenta. La empresa no administra citas ni hace de intermediario.",
  },
  {
    q: "¿Sirve para equipos pequeños de menos de 50 personas?",
    a: "Sí. Trabajamos con empresas desde 20 colaboradores. No necesitas tener cientos de empleados para dar un beneficio de salud profesional.",
  },
  {
    q: "¿Complementa al IMSS?",
    a: "Perfectamente. El IMSS cubre atención médica formal con sus tiempos y procesos. MediPass cubre lo cotidiano: la orientación inmediata de noche, la consulta a domicilio cuando alguien no puede moverse, el descuento en medicinas. Los dos juntos dan una cobertura mucho más completa.",
  },
  {
    q: "¿Es deducible para mi empresa?",
    a: "Al ser una prestación para tus colaboradores, normalmente se registra como gasto deducible y te entregamos factura. Te recomendamos confirmarlo con tu contador según el régimen de tu empresa.",
  },
  {
    q: "¿Mis colaboradores también pueden incluir a su familia?",
    a: "Sí. Hay planes familiares que cubren hasta 8 integrantes de la familia del colaborador. También hay planes individuales si prefieres empezar solo con el equipo.",
  },
  {
    q: "¿Qué pasa si un colaborador deja la empresa?",
    a: "Nos avisas y ajustamos las membresías en la siguiente renovación. La administración es sencilla y no implica trámites complicados para tu equipo de RH.",
  },
  {
    q: "¿Sirve para temas de bienestar emocional o NOM-035?",
    a: "Incluye orientación emocional y apoyo al bienestar laboral, que suman a un entorno más sano. No sustituye una auditoría ni el cumplimiento legal formal de la NOM-035, pero es un buen complemento de tu estrategia de bienestar.",
  },
  {
    q: '¿Por qué pagar por esto si muchos empleados "nunca se enferman"?',
    a: "Porque no es solo para enfermarse. Sirve cada vez que alguien necesita orientación médica de noche, una consulta a domicilio, apoyo emocional, una limpieza dental o un descuento en medicinas — para ellos y su familia. Es respaldo cotidiano, no solo un plan de emergencia.",
  },
] as const;
