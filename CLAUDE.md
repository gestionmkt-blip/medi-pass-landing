# MediPass Landing — Contexto del Proyecto

## ¿Qué es este proyecto?
Landing page para conseguir clientes B2B (empresas) para MediPass.
- El visitante llena un formulario de varios pasos
- Los datos van a un CRM en Notion
- Al final se agenda una cita por Calendly

## Repositorio
- GitHub: `gestionmkt-blip/medi-pass-landing`
- Carpeta local: `C:\Users\MKT\medi-pass-landing`

## Proyecto de Vercel
- Dominio real (el que se usa en anuncios): `https://medipass-empresas.vercel.app` (SIN guión)
- Proyecto en Vercel: `medipass-empresas/medi-pass-landing` — `.vercel/project.json` ya está vinculado a este proyecto
- Existió un proyecto duplicado (`gestionmkt-blip-medi-pass-landing`, dominio `medi-pass-empresas.vercel.app` CON guión) creado por una importación manual separada del mismo repo de GitHub. Se migró el webhook de Calendly al dominio correcto y se eliminó (jun 2026). Si algún día vuelve a aparecer un dominio con guión, es porque alguien reimportó el repo en otra cuenta/team de Vercel — no es un problema de código.

## Tecnologías usadas
- **TanStack Start 1.167** — el framework principal (como Next.js pero diferente)
- **React 19** — para construir la interfaz
- **TypeScript** — JavaScript con tipos para evitar errores
- **Tailwind v4** — para los estilos visuales
- **Vercel** — donde se publica el sitio

## Archivos importantes
- `src/routes/index.tsx` — el formulario principal con todos los pasos
- `api/submit-lead.ts` — el código que envía los datos a Notion (corre en Vercel)
- `src/lib/actions/submitLead.ts` — el intermediario que llama a la API

## Formulario (pasos en orden)
1. Empresa
2. Colaboradores (cuántos trabajan ahí) — rangos: 1–50, 50–150, 150–250, 250+
3. Rol (puesto de quien llena)
4. Salud (si tienen seguro médico)
5. Nombre
6. Correo
7. WhatsApp

## Integración con Notion
- Archivo: `api/submit-lead.ts`
- Variables de entorno necesarias en Vercel: `NOTION_TOKEN`, `NOTION_DATABASE_ID`, y `CALENDLY_WEBHOOK_SIGNING_KEY`
- Campos que se llenan automáticamente: Etapa="Nuevo lead", Fuente="Landing MediPass", Primer Contacto=fecha de hoy
- `.env` local ya configurado con credenciales reales (jun 2025)
- Pruebas de envío a Notion ya funcionando correctamente
- Campos enviados: Empresa, Contacto, Puesto, Correo (tipo email), WhatsApp, Ciudad, # Colaboradores, Seguro actual, Notas (rango de colaboradores)
- CRM data source ID: `collection://3646eeb2-8f1c-8055-a244-000b1a22e641`

## Integración con Calendly
- Archivo: `api/calendly-webhook.ts`
- Escucha eventos `invitee.created` y `invitee.canceled`
- Al agendar: actualiza lead en Notion a "Discovery agendado"
- Al cancelar: actualiza a "Cita cancelada" y agrega nota
- Requiere `CALENDLY_WEBHOOK_SIGNING_KEY` en variables de entorno
- La suscripción del webhook se configura a mano vía API de Calendly (`POST /webhook_subscriptions`), no hay script en el repo que la cree — no existe automatización para esto
- `CALENDLY_WEBHOOK_SIGNING_KEY` es una variable "Sensitive" en Vercel: una vez guardada no se puede volver a leer (ni por CLI ni por dashboard). Si hay que recrear el webhook de Calendly, hay que generar un signing key nuevo, actualizarlo en Vercel, hacer redeploy, y crear la suscripción nueva con ese mismo valor antes de borrar la vieja
- Única suscripción activa actual apunta a `https://medipass-empresas.vercel.app/api/calendly-webhook` (rotada jun 2026 tras encontrar una suscripción duplicada apuntando al dominio con guión)

### CAPI de Meta (en calendly-webhook.ts)
- Envía evento `Schedule` a Meta Conversions API al agendar
- `event_time` = `Math.floor(Date.now() / 1000)` — momento del agendamiento, NO la hora de la cita
  - Usar `start_time` como `event_time` causaba error 2804004 ("marca de tiempo posterior a la actual")
- La hora de la cita (`start_time`) se envía en `custom_data.appointment_time`
- `META_PIXEL_ID` y `META_ACCESS_TOKEN` se leen con `.trim()` para evitar que espacios/saltos rompan la llamada
- `user_data` solo manda `em` (correo hasheado) — sin `ph`, `fbp`, `fbc`, `client_ip` ni `user_agent` (peor match quality que el evento `Lead`; el evento `Lead` sí manda `client_ip_address`/`client_user_agent` desde jul 2026)
- No soporta `test_event_code` (a diferencia de `submit-lead.ts`)

## Auditoría Meta Pixel + CAPI (jul 2026)
Mapa completo de todos los eventos que se mandan a Meta, dónde viven y su estado de deduplicación.

**Eventos solo-Pixel (browser, sin CAPI):**
- `PageView` — `src/routes/__root.tsx` (carga inicial + cada cambio de ruta SPA)
- `InitiateCheckout` — `src/routes/index.tsx`, en `goNext()`, la primera vez que el usuario avanza en el cuestionario. Manda `{ content_name: "Cuestionario MediPass B2B" }`. **No tiene contraparte CAPI ni eventID** — su match quality depende 100% del navegador

**Eventos Pixel + CAPI deduplicados (mismo eventID en ambos lados):**
- `Lead` — Pixel en `index.tsx` (`handleSubmit`) + CAPI en `api/submit-lead.ts` (`sendCapiLead`, se dispara tras guardar en Notion, solo si hay correo). `eventID` se genera en el cliente (`lead_<timestamp>_<random>`) y viaja en el mismo POST al servidor, así que ambos lados usan el mismo `event_id`. CAPI manda `em`, `ph` (si hay whatsapp), `fbp` y `fbc` (cookies capturadas en el cliente), todo hasheado con SHA-256 salvo fbp/fbc
- `Schedule` — Pixel en `index.tsx` (listener del postMessage `calendly.event_scheduled`) + CAPI en `api/calendly-webhook.ts` (`sendCapiSchedule`, en `handleCreated`). Ambos lados derivan el mismo `eventID` con la misma fórmula (`sched_` + último segmento del URI del evento de Calendly), así que quedan deduplicados sin necesidad de pasarse el ID explícitamente

**Config:**
- `META_TEST_EVENT_CODE` es temporal (para pruebas en Meta Events Manager) y solo aplica al evento `Lead` en `api/submit-lead.ts` — si sigue seteado en Vercel, revisar si hay que quitarlo para que los Lead cuenten en producción y no solo en modo test
- El evento `Lead` (`submit-lead.ts`) manda `client_ip_address`/`client_user_agent` desde jul 2026 (tomados de `x-forwarded-for` y `user-agent` del `Request`). El evento `Schedule` (`calendly-webhook.ts`) todavía no los manda — pendiente si se quiere mejorar su match quality también

## Variables de entorno requeridas
- `NOTION_TOKEN` — token de integración de Notion
- `NOTION_DATABASE_ID` — ID de la base de datos CRM B2B (`3646eeb28f1c80d19c50df0fe52f2fc0`)
- `CALENDLY_WEBHOOK_SIGNING_KEY` — llave de firma del webhook de Calendly
- `META_PIXEL_ID` — ID del Pixel de Meta (`2180083942783887`) — usado por CAPI en el webhook de Calendly — **ya configurado en Vercel**
- `META_ACCESS_TOKEN` — token de acceso del sistema de Meta Marketing API — usado por CAPI en el webhook de Calendly — **ya configurado en Vercel**

## VSL (Video Sales Letter)
- Actualmente embebido desde YouTube: `https://www.youtube.com/watch?v=dDkPlIWy11I`
- Componente: `HeroVideo` en `src/routes/index.tsx`
- El embed de YouTube no permite ocultar el título, canal ni logo (YouTube eliminó esa opción en 2018)
- Decisión: quedarse en YouTube por ahora y migrar a Bunny Stream cuando se quiera player completamente limpio
- Bunny Stream es la opción elegida para migración futura: sin branding, autoplay, ~$0.10–1/mes para tráfico B2B
- Al migrar: reemplazar el `<iframe>` de YouTube por el embed de Bunny Stream en `HeroVideo`

## Pendientes conocidos
- `CALENDLY_URL` (`src/lib/content.ts`) ya tiene la URL real de Calendly, no es un placeholder.
- **Decisión pendiente**: el video del hero (`HeroVideo`) sigue siendo un iframe de YouTube con autoplay que carga incondicionalmente arriba del fold — es una carga pesada en móvil. Cambiarlo a un facade (miniatura + botón play que inyecta el iframe hasta que el usuario lo toca) mejoraría el rendimiento pero cambia el comportamiento de autoplay-muted actual, que es una decisión de marketing (la barra de atención dice "reproduce este video antes de continuar"). No se tocó sin confirmarlo primero.

## Incidente: cero leads pese a tráfico de anuncios (jul 2026)
Contexto: la campaña de Meta Ads mandó ~576 clics y ~276 PageViews en varias semanas y hubo CERO leads (ni en Notion ni el evento `Lead` del píxel, salvo pruebas internas). Se investigó y encontró (NO era lo que parecía a primera vista — Notion nunca se llamó desde el cliente, y las variables de entorno sí estaban bien configuradas):

1. **Bug real, confirmado en producción con la consola del navegador — React error #418 (hydration mismatch) en cada carga.** Causa raíz: `scripts/generate-static.js` (un script casero, heredado de un intento de deploy a GitHub Pages) generaba un `dist/client/index.html` vacío — solo `<script>` tags, sin el árbol real de la app — pero el cliente usa `hydrateRoot(document, ...)` (entrada por defecto de TanStack Start), que espera que el HTML ya coincida con lo que React va a renderizar. Como no coincidía, React descartaba todo el árbol y volvía a renderizar desde cero en cada carga.
   - **Fix**: se eliminó `scripts/generate-static.js` por completo y se habilitó el prerender nativo de TanStack Start en `vite.config.ts` (`tanstackStart({ prerender: { enabled: true, crawlLinks: true } })`), que genera el HTML real y coincidente en el build. `package.json` (`build:static`) ahora es solo `vite build`.
2. **Pantalla en negro varios segundos justo después de enviar el formulario**, reproducida en vivo con datos de prueba: el envío al servidor se completaba bien, pero la vista `ThankYou` no se veía durante unos segundos (coincidía con una recurrencia del error #418). En una conexión móvil real esto se ve como que el sitio se congeló.
   - **Fix**: resuelto como efecto secundario del fix de prerender (ya no ocurre el error), más `window.scrollTo({top:0})` agregado en `src/routes/index.tsx` al pasar a la vista `thankyou` (mismo patrón que ya existía para `scheduled`), como defensa adicional por si el usuario había hecho scroll.
3. **Layout shift durante el cuestionario**: un clic apuntado a "1 – 50" terminó seleccionando "250+" porque el contenido se movió entre el render y el clic (fuentes de Google Fonts cargando con `display=swap`, causando reflow al hacer swap de fuente fallback → webfont).
   - **Fix**: cambiado `display=swap` → `display=optional` en el link de Google Fonts (`src/routes/__root.tsx`). Verificado que ya no ocurre el mis-click en la misma prueba.
4. Adicional (no relacionado al incidente pero corregido de paso): `api/submit-lead.ts` ahora loggea el payload completo como `LEAD_FALLBACK` si falla el POST a Notion (para nunca perder el lead aunque Notion esté caído), y el evento CAPI `Lead` ahora manda `client_ip_address` y `client_user_agent` (mejora match quality con Meta).

**Cómo se diagnosticó**: `curl` directo al endpoint de producción (confirmó que el API funciona), `npx vercel env ls production` (confirmó que las env vars sí existían), `mcp__plugin_vercel_vercel__get_runtime_errors`/`get_runtime_logs` (confirmó cero errores de servidor en `/api/submit-lead` en 7 días — es decir, casi nadie llegaba a invocarlo), y pruebas reales en el navegador (Chrome vía `claude-in-chrome`) con viewport móvil, incluyendo un envío end-to-end con datos de prueba (`TEST QA...` / `prueba.*@example.com` — buscar y borrar esas entradas en Notion si siguen ahí, y excluir esos eventos `Lead` de prueba en Meta Events Manager si aparecen).

## Cómo correr el proyecto localmente
```bash
# Para desarrollo normal (sin API de Notion)
npm run dev

# Para probar también el envío a Notion
vercel dev
```

## Meta Pixel
- Pixel ID: `2180083942783887`
- Snippet base en `src/routes/__root.tsx` — dispara `PageView` al cargar
- Evento `Lead` se dispara en `src/routes/index.tsx` al completar el formulario exitosamente
- `lang` del HTML configurado como `es-MX`
- El pixel se inicializa con `document.createElement('script')` en un `useEffect` (NO `dangerouslySetInnerHTML`) — el navegador sí ejecuta scripts creados así
- Verificado en producción: `window.fbq` es función, `fbevents.js` v2.9.347 cargado, cola vacía (eventos enviados)

## Pantalla post-formulario (ThankYou)
- Componente: `ThankYou` en `src/routes/index.tsx`
- Muestra el primer nombre del lead en el título: "¡Ya casi terminas, [Nombre]!"
- Tiene checkbox de confirmación antes de mostrar el calendario de Calendly
- El botón de agendar se habilita solo cuando el checkbox está marcado

## FAQs
- Definidas en `src/lib/content.ts` como constante `FAQS`
- Renderizadas en el componente `FaqSection` de `src/routes/index.tsx`

## Deploy
- Se publica en Vercel, proyecto `medipass-empresas/medi-pass-landing` (ver sección "Proyecto de Vercel")
- El build (`vite build`, alias `build:static`) usa el **prerender nativo de TanStack Start** (`vite.config.ts` → `tanstackStart({ prerender: { enabled: true, crawlLinks: true } })`) para generar `dist/client/index.html` con el HTML real ya renderizado — NO existe ya ningún script casero de post-build (se eliminó `scripts/generate-static.js` en jul 2026, ver sección de incidente abajo)
- Configurado en `vercel.json`
- `vercel` no está instalado global — usar `npx vercel` (ej. `npx vercel env ls production`, `npx vercel deploy --prod`)
- Los deploys de Preview están protegidos por Vercel SSO — solo se ven autenticado en el dashboard/con sesión de Chrome logueada, `curl` sin auth recibe 302

## Comunicación
- Hablar siempre en español mexicano con lenguaje sencillo
