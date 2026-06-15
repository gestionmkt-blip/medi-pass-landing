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
2. Colaboradores (cuántos trabajan ahí)
3. Rol (puesto de quien llena)
4. Salud (si tienen seguro médico)
5. Nombre
6. Correo
7. WhatsApp

## Integración con Notion
- Archivo: `api/submit-lead.ts`
- Variables de entorno necesarias en Vercel: `NOTION_TOKEN` y `NOTION_DATABASE_ID`
- Campos que se llenan automáticamente: Etapa="Nuevo lead", Fuente="Landing MediPass", Primer Contacto=fecha de hoy

## Pendientes conocidos
- Reemplazar el placeholder de `CALENDLY_URL` en `src/routes/index.tsx` línea 29

## Cómo correr el proyecto localmente
```bash
# Para desarrollo normal (sin API de Notion)
npm run dev

# Para probar también el envío a Notion
vercel dev
```

## Deploy
- Se publica en Vercel
- El build genera archivos estáticos en `dist/client/`
- Configurado en `vercel.json`

## Comunicación
- Hablar siempre en español mexicano con lenguaje sencillo
