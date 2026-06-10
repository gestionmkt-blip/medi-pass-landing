# MediPass VSL Landing — Diseño

**Fecha:** 2026-06-09
**Estado:** Aprobado

---

## Objetivo

Rehacer la landing page de MediPass como una página de alta conversión para dueños de empresa. La página tiene un solo trabajo: capturar leads calificados que agenden una llamada de cotización.

---

## Estructura de la página

Una sola página. Sin secciones de contenido adicional. Todo el tráfico converge en dos acciones: ver el VSL y llenar el formulario.

```
Nav
Hero oscuro (headline + VSL)
Sección de formulario (blanca)
Trust signals
Footer mínimo
```

---

## Secciones

### Nav
- Fondo negro (`#111`)
- Logo MediPass a la izquierda (imagen existente: `public/medipass-logo.png`)
- Botón CTA "Cotización gratis" en coral (`#EA6B48`), esquinas redondeadas, a la derecha
- Al hacer clic en el CTA, hace scroll suave hasta el formulario

### Hero (fondo negro `#111`)
- Badge pequeño: "Para dueños de empresa" — fondo coral tenue, texto coral
- Headline principal (blanco, extrabold): "Protege la salud de tu equipo sin pagar un seguro caro"
  - "sin pagar un seguro caro" en coral
- Subheadline (gris claro): "Mira el video y descubre cómo más de 1,000 colaboradores ya tienen respaldo médico desde $450 al año."
- VSL placeholder: fondo negro, relación 16:9, botón de play circular en coral centrado
  - Leyenda debajo: "⏱ Video de 3 minutos — míralo completo antes de cotizar"
  - Cuando haya video real: reemplazar con `<iframe>` de YouTube o Vimeo

### Formulario (fondo blanco)
- Label pequeño: "Cotización gratuita" en coral
- Título: "Solicita tu propuesta personalizada"
- Subtítulo: "Sin costo ni compromiso. Un asesor te contacta en menos de 24 hrs."
- **8 campos:**
  1. Nombre completo
  2. Empresa
  3. Puesto (CEO, RRHH, Director…)
  4. WhatsApp
  5. Correo electrónico
  6. Número de colaboradores
  7. Ciudad
  8. ¿Tienen algún seguro o beneficio de salud? (select: Sí / No / No sé)
- Layout en grid 2 columnas en móvil para campos cortos; ancho completo para campos largos
- Botón submit: "Quiero mi cotización →" — coral, ancho completo, esquinas redondeadas
- Disclaimer debajo: "Sin spam. Solo te contactamos para enviarte tu propuesta."
- **Comportamiento al enviar:** El formulario no redirige. Muestra el estado de "Gracias" en la misma página (reemplaza el contenido del formulario).

### Trust signals
- 3 puntos debajo del formulario: "Cobertura nacional · Activación en 48 hrs · Sin permanencia"
- Fondo gris muy claro, separador sutil

### Footer mínimo
- Fondo negro
- Logo/nombre MediPass
- Texto legal: "Los servicios se brindan a través de proveedores en convenio. © 2026 MediPass"

---

## Estado post-envío (pantalla de Gracias)

Reemplaza el contenido principal en la misma página. Fondo negro, mismo estilo que el hero.

### Contenido:
1. Ícono/emoji de celebración
2. Título: "¡Listo! Ya recibimos tu solicitud"
3. Subtítulo: "El siguiente paso es agendar una llamada de 20 minutos con un miembro de nuestro equipo."
4. **Sección "En la llamada vamos a:"** (lista de 3 pasos numerados con círculos coral):
   - Entender el tamaño y necesidades de tu equipo
   - Explicarte qué plan se adapta mejor a tu empresa
   - Enviarte una propuesta con precio exacto al terminar
5. Badge: "📅 Llamada de 20 minutos · Gratis · Sin compromiso"
6. **Checkbox de compromiso** (debe palomearse para activar el botón):
   - Texto: "Confirmo que soy responsable de tomar o proponer decisiones de beneficios en mi empresa, y que quiero recibir una propuesta real para mis colaboradores."
   - Al palomear: el checkbox se pone coral, el botón se activa
7. **Botón de Calendly:** "Agendar mi llamada →"
   - Deshabilitado (gris) hasta que el checkbox esté palomeado
   - Al activarse: coral, con hover que lo eleva ligeramente
   - Hint debajo: "Confirma el recuadro de arriba para continuar" → cambia a "Todo listo — selecciona tu horario" al palomear
   - Enlace: placeholder `#` — reemplazar con URL real de Calendly
8. Divider + disclaimer legal

---

## Branding y estilos

Mantiene el branding existente del proyecto:

| Variable | Valor |
|----------|-------|
| Coral | `#EA6B48` |
| Negro | `#111111` |
| Blanco | `#ffffff` |
| Gris texto | `#444444` |
| Gris suave | `#aaaaaa` |
| Línea | `#e8e8e8` |

- Tipografía: la existente en el proyecto (Tailwind/sistema)
- Animaciones: las del componente `Reveal` existente para entradas suaves

---

## Mobile-first

El diseño se construye primero para teléfono (360–430px de ancho). El desktop es la adaptación:
- En móvil: todo apilado verticalmente
- En desktop (md+): el formulario puede tener grid 2 columnas para algunos campos, max-width de 680px centrado

---

## Comportamiento del formulario

- Validación HTML5 nativa (`required`) para todos los campos
- Sin librería de formularios externa — solo estado de React con `useState`
- Al enviar: `handleSubmit` previene el default, valida, muestra estado de éxito en pantalla
- No se integra con backend por ahora — el submit solo cambia el estado visual a "Gracias"
- Placeholder para futura integración: comentario en el código indicando dónde agregar el `fetch` al endpoint

---

## Archivos a modificar

- `src/routes/index.tsx` — reemplazar todo el componente `MediPassLanding` con la nueva estructura
- `src/styles.css` — ajustes mínimos si necesario (la mayoría via Tailwind + inline styles)
- No se crean archivos nuevos de componentes — todo vive en `index.tsx` para mantener simplicidad

---

## Lo que NO se construye (fuera de scope)

- Integración real con Calendly (solo link placeholder)
- Envío real del formulario a backend/CRM (solo estado visual)
- Secciones de contenido: planes, FAQ, proceso, testimonios (eliminadas en esta versión)
- Analytics o tracking de eventos
