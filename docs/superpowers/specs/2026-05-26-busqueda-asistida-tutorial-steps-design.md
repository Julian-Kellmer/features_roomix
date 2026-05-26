# Diseño: Nuevos pasos del tutorial en Búsqueda Asistida

**Fecha:** 2026-05-26  
**Archivo afectado:** `src/pages/BusquedaAsistida.tsx`

## Objetivo

Ampliar el tutorial de Feature 2 (Búsqueda Asistida) para que quien vea el demo entienda:
- Que el usuario elige su estilo de vida, no filtros técnicos
- Que seleccionar "oficina" desbloquea un input de dirección
- Que esa dirección se convierte en el Punto B del mapa
- Que el plan es integrar Google Travel API para calcular opciones reales de commute en transporte público

## Cambios

### 1. Pre-seleccionar "oficina" por defecto

```ts
const [answers, setAnswers] = useState<Answers>({
  trabajo: 'oficina',  // era ''
  ...
})
```

Esto hace que el `locationWrap` (input de dirección) sea visible desde el inicio, permitiendo que el tutorial apunte a él sin que el usuario tenga que interactuar primero.

### 2. Nuevos refs

| Ref | Elemento apuntado |
|-----|-------------------|
| `cardGridRef` | ya existe — grid de opciones de step 1 |
| `oficinaBtnRef` | nuevo — botón "Voy a la oficina" |
| `locationWrapRef` | nuevo — div que contiene el input de dirección |
| `bottomBarRef` | ya existe — barra inferior con botón Siguiente |

### 3. Pasos del tutorial (reemplaza los 3 actuales)

| # | Target | Título | Descripción |
|---|--------|--------|-------------|
| 0 | ninguno (centro) | Feature 2 — Búsqueda asistida | Para usuarios que no saben qué quieren. Los guiamos con preguntas simples sobre su estilo de vida. |
| 1 | `cardGridRef` | Sin tecnicismos | El usuario no elige filtros — elige cómo vive. Cada opción tiene emoji y descripción corta. |
| 2 | `oficinaBtnRef` | Elegí "Voy a la oficina" | Cuando el usuario va a la oficina, le pedimos la dirección. Eso nos da el destino real de commute. |
| 3 | `locationWrapRef` | Esta es la dirección de trabajo — el Punto B | La dirección ingresada se convierte en el Punto B del mapa. Desde ahí calculamos la cercanía de cada propiedad. |
| 4 | `locationWrapRef` | Próximo paso: Google Travel API | En producción, con esta dirección consultamos la API de Google Travel para obtener opciones reales de transporte público — subte, colectivo, tiempo en hora pico. |
| 5 | `bottomBarRef` | Perfil personalizado al final | Con todas las respuestas armamos un perfil del usuario y lo llevamos directo a las propiedades que mejor le encajan. |

## Lo que NO cambia

- Lógica de navegación entre pasos del wizard
- Comportamiento de `canAdvance()`
- Diseño visual del tutorial (OnboardingTutorial.tsx sin modificaciones)
