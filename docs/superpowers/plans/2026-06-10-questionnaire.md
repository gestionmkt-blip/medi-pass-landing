# Cuestionario Multi-Paso Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar `FormSection` por `QuizSection`, un cuestionario de 4 pasos con animación de slide y navegación hacia atrás.

**Architecture:** Todo el cambio vive en `src/routes/index.tsx`. `QuizSection` maneja su propio estado (step, direction, answers). Las keyframes de animación se añaden a `src/styles.css`. Cada paso se re-monta via `key={step}` para disparar la animación CSS. Al enviar se llama el mismo `onSubmit()` prop que el formulario anterior.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, sin librería de animación externa.

---

### Task 1: Añadir keyframes de animación a `src/styles.css`

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Añadir las keyframes al final del archivo**

Agrega esto al final de `src/styles.css`:

```css
@keyframes quizSlideRight {
  from { transform: translateX(40px); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}

@keyframes quizSlideLeft {
  from { transform: translateX(-40px); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}

.quiz-slide-right { animation: quizSlideRight 280ms ease-out both; }
.quiz-slide-left  { animation: quizSlideLeft  280ms ease-out both; }
```

- [ ] **Step 2: Verificar que el servidor de dev no tire error de CSS**

El servidor ya debe estar corriendo en `http://localhost:3000`. Abre las DevTools → Console y confirma que no hay errores de CSS.

- [ ] **Step 3: Commit**

```bash
git add src/styles.css
git commit -m "style: keyframes quiz slide para cuestionario multi-paso"
```

---

### Task 2: Añadir tipos y constante STEPS en `src/routes/index.tsx`

**Files:**
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Añadir el tipo `QuizAnswers` y la constante `STEPS`**

Después de la línea `const CALENDLY_URL = ...` (línea ~29), añade:

```ts
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
```

- [ ] **Step 2: Verificar que TypeScript no tire errores**

```bash
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat(quiz): tipos QuizAnswers y constante QUIZ_STEPS"
```

---

### Task 3: Añadir `ProgressBar` en `src/routes/index.tsx`

**Files:**
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Añadir el componente `ProgressBar` antes de `TrustSignals`**

```tsx
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-5 flex gap-1.5">
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
```

- [ ] **Step 2: Verificar TS**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat(quiz): componente ProgressBar"
```

---

### Task 4: Añadir `SelectionStep` en `src/routes/index.tsx`

**Files:**
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Añadir el componente `SelectionStep` después de `ProgressBar`**

```tsx
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
```

- [ ] **Step 2: Verificar TS**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat(quiz): componente SelectionStep"
```

---

### Task 5: Añadir `ContactStep` en `src/routes/index.tsx`

**Files:**
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Añadir el componente `ContactStep` después de `SelectionStep`**

```tsx
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
            <input
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
```

- [ ] **Step 2: Verificar TS**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat(quiz): componente ContactStep"
```

---

### Task 6: Añadir `QuizSection` en `src/routes/index.tsx`

**Files:**
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Añadir `QuizSection` después de `ContactStep`**

```tsx
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
                  className="rounded-full px-6 py-2.5 text-sm font-bold text-white transition-all active:scale-95"
                  style={{ background: CORAL }}
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
```

- [ ] **Step 2: Verificar TS**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Verificar en browser**

Abre `http://localhost:3000`, scrollea a la sección del cuestionario y verifica:
- Se ven los 4 segmentos de progreso
- Paso 1 muestra las 4 opciones de colaboradores en grid 2×2
- El botón "Siguiente →" está deshabilitado hasta elegir opción
- Al elegir una opción se activa el botón

- [ ] **Step 4: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat(quiz): componente QuizSection con animación slide"
```

---

### Task 7: Reemplazar `FormSection` con `QuizSection` y limpiar código muerto

**Files:**
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Cambiar la referencia en `MediPassLanding`**

En la función `MediPassLanding`, reemplaza:

```tsx
<FormSection onSubmit={() => setSubmitted(true)} />
```

por:

```tsx
<QuizSection onSubmit={() => setSubmitted(true)} />
```

- [ ] **Step 2: Eliminar `FormSection`**

Elimina la función `FormSection` completa (líneas ~189–319 del archivo original).

- [ ] **Step 3: Eliminar `schema`, `Field`, `inputCls` y `FormData`**

Elimina:
- La constante `schema` (el objeto `z.object({...})`)
- El tipo `type FormData = z.infer<typeof schema>`
- La función helper `inputCls`
- La función componente `Field`

- [ ] **Step 4: Eliminar imports no usados**

Elimina del bloque de imports en la línea 1–7:
- `useForm` de `react-hook-form`
- `z` de `zod`
- `zodResolver` de `@hookform/resolvers/zod`
- El tipo `ReactNode` de `react` (ya no se usa en `Field`)

El import de `react` queda solo como:

```ts
import { useState } from "react";
```

- [ ] **Step 5: Verificar TS sin errores**

```bash
npx tsc --noEmit
```

Esperado: cero errores.

- [ ] **Step 6: Verificar flujo completo en browser**

Abre `http://localhost:3000` y prueba el flujo de punta a punta:
1. Paso 1: elige un rango de colaboradores → Siguiente
2. Paso 2: elige un rol → Siguiente  
3. Paso 3: elige un beneficio → Siguiente
4. Paso 4: llena nombre, correo y WhatsApp → Enviar
5. Confirma que aparece la pantalla `ThankYou`
6. Regresa con el botón Atrás en pasos 2, 3 y 4 y verifica que la selección se mantiene
7. Verifica que en el paso 4, "Enviar" sin llenar campos muestra errores inline

- [ ] **Step 7: Commit final**

```bash
git add src/routes/index.tsx
git commit -m "feat: reemplazar FormSection con QuizSection multi-paso

- Cuestionario de 4 pasos con animación slide
- Barra de progreso, botón Atrás, validación inline
- Elimina dependencias react-hook-form y zod"
```
