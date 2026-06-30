# MediPass Landing — Contexto del Proyecto

## ¿Qué es este proyecto?
Landing page para conseguir clientes B2B (empresas) para MediPass.
- El visitante llena un formulario de varios pasos
- Los datos van a un CRM en Notion
- Al final se agenda una cita por Calendly

## Repositorio
- GitHub: `gestionmkt-blip/medi-pass-landing`
- Carpeta local: `C:\Users\MKT\medi-pass-landing`

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
- Reemplazar el placeholder de `CALENDLY_URL` en `src/routes/index.tsx` línea 29

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

## Pantalla post-formulario (ThankYou)
- Componente: `ThankYou` en `src/routes/index.tsx`
- Muestra el primer nombre del lead en el título: "¡Ya casi terminas, [Nombre]!"
- Tiene checkbox de confirmación antes de mostrar el calendario de Calendly
- El botón de agendar se habilita solo cuando el checkbox está marcado

## FAQs
- Definidas en `src/lib/content.ts` como constante `FAQS`
- Renderizadas en el componente `FaqSection` de `src/routes/index.tsx`

## Deploy
- Se publica en Vercel
- El build genera archivos estáticos en `dist/client/`
- Configurado en `vercel.json`

## Comunicación
- Hablar siempre en español mexicano con lenguaje sencillo
