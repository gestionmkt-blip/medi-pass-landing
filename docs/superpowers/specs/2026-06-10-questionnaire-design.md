# Spec: Cuestionario multi-paso (reemplaza FormSection)

**Fecha:** 2026-06-10
**Branch:** test-2

---

## Objetivo

Reemplazar el `FormSection` (formulario de una sola pantalla) por un cuestionario de 4 pasos con animación de slide y navegación hacia atrás, manteniendo los mismos datos recolectados y fluyendo al mismo `ThankYou` actual.

---

## Flujo de pasos

| Paso | Pregunta | Tipo | Opciones |
|------|----------|------|---------|
| 1 | ¿Cuántos colaboradores tiene tu empresa? | Radio (grid 2×2) | 1–10 / 11–30 / 31–100 / 100+ |
| 2 | ¿Cuál es tu rol en la empresa? | Radio (lista) | Dueño / CEO / Director General · Director / Gerente de RRHH · Gerente o Coordinador · Otro — tomo decisiones de beneficios |
| 3 | ¿Hoy tienen algún beneficio de salud para su equipo? | Radio (lista) | Sí — seguro médico privado · Sí — solo IMSS / ISSSTE · No tenemos nada · No estoy seguro |
| 4 | ¿A dónde te enviamos la propuesta? | Inputs de texto | Nombre completo · Correo electrónico · WhatsApp |

---

## Componente `QuizSection`

Reemplaza `FormSection` en `index.tsx`. Recibe `onSubmit: () => void` (mismo contrato que hoy).

### Estado interno

```ts
step: 0..3          // paso activo
direction: 1 | -1   // 1 = avanzar, -1 = retroceder (controla animación)
answers: {
  colaboradores: string   // "1-10" | "11-30" | "31-100" | "100+"
  rol: string
  salud: string
  nombre: string
  correo: string
  whatsapp: string
}
```

### Validación

- Pasos 1–3: requiere que haya una opción seleccionada para habilitar "Siguiente".
- Paso 4: nombre ≥ 2 chars, correo válido, whatsapp ≥ 10 chars. Validación inline al intentar enviar.
- El botón "Siguiente" aparece deshabilitado (opacity reducida) hasta que haya selección.

### Animación

CSS keyframes con `translateX`. Al avanzar: la pantalla actual sale a `-100%` y la nueva entra desde `+100%`. Al retroceder: invertido. Duración ~280ms, `ease-in-out`.

No se usa ninguna librería de animación — solo CSS puro con clases que se aplican/remueven vía estado.

### Barra de progreso

4 segmentos, uno por paso. Los pasos anteriores al activo se colorean con `CORAL`. El segmento activo con `CORAL` a 50% opacidad. Los restantes en gris oscuro.

### Navegación

- **Siguiente** — habilitado solo si hay selección/valores válidos en el paso actual.
- **Atrás** — siempre visible en pasos 2–4; oculto (invisible) en el paso 1.
- **Enviar** (paso 4) — reemplaza "Siguiente"; dispara validación y llama `onSubmit()`.

### Contenedor

- Fondo: `BG_DARK` (mismo dark que el resto de la página, a diferencia del `FormSection` blanco actual).
- Ancho máximo: `max-w-lg`, centrado.
- La tarjeta del cuestionario tiene `overflow: hidden` para que el slide no se derrame.

---

## Datos que se recolectan (equivalencia con el form anterior)

| Campo nuevo | Campo antiguo |
|-------------|---------------|
| `colaboradores` (rango) | `colaboradores` (número) |
| `rol` (opción) | `puesto` (texto libre) |
| `salud` (opción) | `seguro` (si/no/no_se) |
| `nombre` | `nombre` |
| `correo` | `correo` |
| `whatsapp` | `whatsapp` |

Campos eliminados: `empresa`, `ciudad` (no se recolectan en el cuestionario).

---

## Lo que NO cambia

- `ThankYou` — sin modificaciones.
- `HeroSection`, `FaqSection`, `TrustSignals`, `PageFooter` — sin modificaciones.
- `Nav` — el botón "Cotización gratis" sigue haciendo scroll a `#formulario`.
- El id del `section` sigue siendo `id="formulario"`.

---

## Ubicación del código

Todo en `src/routes/index.tsx`. Se añade el componente `QuizSection` (y subcomponentes internos) en el mismo archivo, reemplazando `FormSection` y el `schema`/`Field` que ya no se necesitan.
