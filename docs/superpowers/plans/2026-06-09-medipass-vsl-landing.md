# MediPass VSL Landing — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar la landing page actual de MediPass con una página de alta conversión: VSL placeholder + formulario de 8 campos + pantalla de "gracias" con checkbox de compromiso y link de Calendly.

**Architecture:** Todo vive en `src/routes/index.tsx`. Se reemplaza el componente `MediPassLanding` y todos sus sub-componentes. Se usa `react-hook-form` + `zod` para validación del formulario. El estado `submitted` en el componente raíz controla si se muestra el formulario o la pantalla de gracias. Mobile-first.

**Tech Stack:** React 19, TypeScript, TanStack Router, Tailwind CSS v4, react-hook-form, zod, Vite

---

## Estructura de archivos

| Archivo | Acción | Qué cambia |
|---------|--------|------------|
| `src/routes/index.tsx` | Modificar | Reemplazar todo el componente `MediPassLanding` y sus sub-componentes. Mantener el `Route` export y los imports de TanStack Router. |

No se crean archivos nuevos. El componente `Reveal` de `@/components/medipass/Reveal` se sigue usando.

---

## Task 1: Limpiar el archivo y crear la estructura base

**Archivos:**
- Modificar: `src/routes/index.tsx`

- [ ] **Paso 1: Correr el servidor de desarrollo**

```bash
npm run dev
```

Abrir `http://localhost:5173` en el navegador. Verificar que la landing actual carga sin errores. Dejar el servidor corriendo en toda la implementación.

- [ ] **Paso 2: Reemplazar el contenido de `src/routes/index.tsx`**

Borrar todo el contenido actual del archivo y escribir esto:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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

function MediPassLanding() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "#111" }}>
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
function Nav() { return null; }
function HeroSection() { return null; }
function FormSection(_: { onSubmit: () => void }) { return null; }
function ThankYou() { return null; }
function TrustSignals() { return null; }
function PageFooter() { return null; }
```

- [ ] **Paso 3: Verificar en el navegador**

La página debe cargar en blanco (fondo negro). Sin errores en la consola del navegador (F12 → Console). Si hay un error de TypeScript en el editor sobre parámetros no usados, está bien por ahora — se resuelve en los siguientes pasos.

- [ ] **Paso 4: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat: estructura base de nueva landing VSL"
```

---

## Task 2: Nav

**Archivos:**
- Modificar: `src/routes/index.tsx` — reemplazar la función `Nav`

- [ ] **Paso 1: Reemplazar la función `Nav` con el código real**

Buscar `function Nav() { return null; }` y reemplazarlo con:

```tsx
function Nav() {
  return (
    <header
      className="sticky top-0 z-40"
      style={{ background: "#111", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
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
          className="rounded-full px-5 py-2.5 text-sm font-bold text-white transition-transform active:scale-95"
          style={{ background: CORAL }}
        >
          Cotización gratis
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Paso 2: Verificar en el navegador**

Debe aparecer el nav en la parte superior: logo de MediPass a la izquierda, botón coral "Cotización gratis" a la derecha. En móvil (puedes simular con F12 → modo responsivo → iPhone) debe verse bien y no desbordarse.

- [ ] **Paso 3: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat: nav de landing VSL"
```

---

## Task 3: Hero + VSL Placeholder

**Archivos:**
- Modificar: `src/routes/index.tsx` — reemplazar la función `HeroSection`

- [ ] **Paso 1: Reemplazar `function HeroSection() { return null; }` con:**

```tsx
function HeroSection() {
  return (
    <section id="top" className="px-5 pb-8 pt-10 text-center" style={{ background: "#111" }}>
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
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed" style={{ color: "#aaa" }}>
            Mira el video y descubre cómo más de 1,000 colaboradores ya tienen respaldo médico
            desde $450 al año.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mx-auto mt-7">
            {/* VSL placeholder — reemplazar con <iframe> de YouTube/Vimeo cuando esté listo */}
            <div
              className="relative w-full overflow-hidden rounded-xl"
              style={{ aspectRatio: "16/9", background: "#000", border: "1px solid #2a2a2a" }}
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
                    style={{ marginLeft: 3 }}
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
```

- [ ] **Paso 2: Verificar en el navegador**

Debe verse: badge coral → headline blanco con acento coral → texto gris → rectángulo negro 16:9 con botón de play coral al centro → leyenda gris. En vista móvil el headline debe ser legible y el video ocupar todo el ancho.

- [ ] **Paso 3: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat: hero y VSL placeholder"
```

---

## Task 4: Formulario de cotización

**Archivos:**
- Modificar: `src/routes/index.tsx` — reemplazar `FormSection`, agregar schema zod, helper `inputCls` y componente `Field`

- [ ] **Paso 1: Agregar el schema de validación**

Justo antes de la función `MediPassLanding`, agregar:

```tsx
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
```

- [ ] **Paso 2: Agregar helpers de estilos**

Justo después del schema, agregar:

```tsx
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
  children: React.ReactNode;
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
```

- [ ] **Paso 3: Reemplazar `function FormSection(_: { onSubmit: () => void }) { return null; }` con:**

```tsx
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
            <div className="grid grid-cols-2 gap-3">
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

            <div className="grid grid-cols-2 gap-3">
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

            <div className="grid grid-cols-2 gap-3">
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
```

- [ ] **Paso 4: Verificar en el navegador**

- La sección blanca con el formulario debe aparecer debajo del hero oscuro.
- Intentar enviar el formulario vacío: deben aparecer mensajes de error en rojo bajo cada campo.
- Llenar todos los campos correctamente y enviar: la página debe cambiar a fondo negro (el estado `submitted` activa `ThankYou`, que por ahora es `null`).
- En móvil: los campos en grid 2 columnas deben ser legibles y no muy pequeños.

- [ ] **Paso 5: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat: formulario de cotizacion con validacion zod"
```

---

## Task 5: Pantalla de Gracias (ThankYou)

**Archivos:**
- Modificar: `src/routes/index.tsx` — reemplazar `function ThankYou() { return null; }`

- [ ] **Paso 1: Reemplazar `function ThankYou() { return null; }` con:**

```tsx
const CALL_EXPECTATIONS = [
  "Entender el tamaño y necesidades de tu equipo",
  "Explicarte qué plan se adapta mejor a tu empresa",
  "Enviarte una propuesta con precio exacto al terminar",
] as const;

function ThankYou() {
  const [checked, setChecked] = useState(false);

  return (
    <section className="px-5 py-12" style={{ background: "#111" }}>
      <div className="mx-auto max-w-lg text-center">
        <Reveal>
          <div className="mb-4 text-5xl">🎉</div>
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
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "#aaa" }}>
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
                  key={i}
                  className="flex items-start gap-3 px-4 py-3"
                  style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : undefined }}
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
            className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition-colors"
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
            <p className="text-xs leading-relaxed" style={{ color: "#bbb" }}>
              Confirmo que soy responsable de tomar o proponer decisiones de beneficios en mi
              empresa, y que quiero recibir una propuesta real para mis colaboradores.
            </p>
          </label>
        </Reveal>

        {/* Botón Calendly — deshabilitado hasta que el checkbox esté palomeado */}
        <Reveal delay={380}>
          <a
            href={checked ? "https://calendly.com/TU_LINK_AQUI" : undefined}
            onClick={!checked ? (e) => e.preventDefault() : undefined}
            target={checked ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="mt-4 block w-full rounded-full py-4 text-center text-base font-black text-white transition-all active:scale-95"
            style={{
              background: checked ? CORAL : "#2a2a2a",
              color: checked ? "white" : "#555",
              cursor: checked ? "pointer" : "not-allowed",
              pointerEvents: checked ? "auto" : "none",
            }}
            aria-disabled={!checked}
          >
            Agendar mi llamada →
          </a>
          <p className="mt-2 text-xs" style={{ color: checked ? "#777" : "#444" }}>
            {checked
              ? "Todo listo — selecciona tu horario"
              : "Confirma el recuadro de arriba para continuar"}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Paso 2: Verificar en el navegador**

- Llenar el formulario y enviarlo correctamente. La página debe transicionar a la pantalla de gracias.
- El botón "Agendar mi llamada" debe verse gris y no ser clickeable.
- Al palomear el checkbox: debe ponerse coral, el botón debe activarse en coral, el hint debe cambiar a "Todo listo — selecciona tu horario".
- En móvil: todo debe ser legible y los elementos bien espaciados.

- [ ] **Paso 3: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat: pantalla de gracias con checkbox y boton de Calendly"
```

---

## Task 6: Trust Signals + Footer

**Archivos:**
- Modificar: `src/routes/index.tsx` — reemplazar `TrustSignals` y `PageFooter`

- [ ] **Paso 1: Reemplazar `function TrustSignals() { return null; }` con:**

```tsx
const TRUST_ITEMS = ["Cobertura nacional", "Activación en 48 hrs", "Sin permanencia forzada"] as const;

function TrustSignals() {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-5 py-5"
      style={{ background: "#fafafa", borderTop: "1px solid #f0f0f0" }}
    >
      {TRUST_ITEMS.map((item) => (
        <span key={item} className="flex items-center gap-2 text-xs" style={{ color: "#777" }}>
          <span
            style={{ width: 6, height: 6, borderRadius: 999, background: CORAL, display: "inline-block", flexShrink: 0 }}
          />
          {item}
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Paso 2: Reemplazar `function PageFooter() { return null; }` con:**

```tsx
function PageFooter() {
  return (
    <footer className="px-5 py-8 text-center" style={{ background: "#111" }}>
      <p className="mb-1 font-black text-white" style={{ fontSize: 16 }}>
        MediPass
      </p>
      <p className="text-xs leading-relaxed" style={{ color: "#444" }}>
        Los servicios se brindan a través de proveedores en convenio.
        <br />
        MediPass no es una aseguradora. © 2026 MediPass
      </p>
    </footer>
  );
}
```

- [ ] **Paso 3: Verificar en el navegador**

- Los 3 trust signals deben aparecer entre el formulario y el footer, sobre fondo gris claro.
- El footer debe ser negro con el texto en gris oscuro.
- En la pantalla de gracias, el footer también debe aparecer correctamente (está fuera del condicional `submitted`).

- [ ] **Paso 4: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat: trust signals y footer"
```

---

## Task 7: Revisión final mobile + pulir detalles

**Archivos:**
- Modificar: `src/routes/index.tsx` — ajustes menores

- [ ] **Paso 1: Revisar en viewport móvil (375px)**

En el navegador, abrir DevTools (F12) → icono de móvil → seleccionar "iPhone SE" o escribir 375 de ancho. Revisar:

1. Nav: logo y botón visibles, sin overflow
2. Headline: texto legible, no muy pequeño
3. VSL: ancho completo, centrado
4. Formulario: campos en grid 2col legibles; en pantallas muy pequeñas el grid puede colapsar a 1col
5. Trust signals: se envuelven bien en múltiples líneas si no caben
6. Pantalla de gracias: checkbox y botón accesibles con el dedo

- [ ] **Paso 2: Colapsar el grid del formulario a 1 columna en pantallas muy pequeñas (< 360px)**

En las secciones con `grid grid-cols-2`, verificar que con Tailwind v4 esto funciona en móvil. Si algún campo se ve muy apretado, cambiar `grid-cols-2` por `grid-cols-1 sm:grid-cols-2` en esos divs.

Ejemplo — buscar los `grid grid-cols-2 gap-3` del formulario y cambiarlos a:
```tsx
<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
```

- [ ] **Paso 3: Agregar `id="top"` a la sección hero**

Verificar que `<section id="top"` ya existe en `HeroSection` (está en el código del Task 3). Si no, agregar el `id`.

- [ ] **Paso 4: Verificar que el botón del nav hace scroll correcto**

Abrir la página, hacer scroll para bajar, y presionar "Cotización gratis" en el nav. Debe hacer scroll suave hasta el formulario.

- [ ] **Paso 5: Revisar en desktop**

Ampliar el navegador a pantalla completa. La página debe verse centrada y bien proporcional. El `max-w-xl` del hero y `max-w-lg` del formulario limitan el ancho máximo.

- [ ] **Paso 6: Verificar que no haya errores de TypeScript**

```bash
npx tsc --noEmit
```

No debe arrojar errores. Si hay alguno, corregirlo antes del commit final.

- [ ] **Paso 7: Commit final**

```bash
git add src/routes/index.tsx
git commit -m "feat: landing VSL de MediPass completa - mobile first"
```

---

## Notas para implementaciones futuras

Estos puntos están fuera del scope actual pero documentados para no olvidarlos:

- **Video real:** En `HeroSection`, buscar el comentario `{/* VSL placeholder */}` y reemplazar el `<div>` negro por `<iframe src="URL_DEL_VIDEO" ...>`
- **Link de Calendly:** En `ThankYou`, buscar `https://calendly.com/TU_LINK_AQUI` y reemplazar con la URL real
- **Integración de formulario:** En `FormSection → submit()`, buscar el comentario `// TODO: aquí va la integración` y agregar el `fetch` al endpoint del CRM
