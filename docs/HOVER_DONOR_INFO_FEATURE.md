# Funcionalidad de Información del Donante con Hover

## ✨ Características Implementadas (v2.0)

Se ha actualizado el modal de notificaciones para mostrar automáticamente la información del donante cuando el cursor pasa sobre una notificación, con animaciones suaves y un indicador visual.

## 🎯 Comportamiento

### Antes
- El usuario tenía que hacer **clic** en una notificación para ver los detalles del donante
- Se abría un modal centrado que ocultaba parte de la lista de notificaciones
- Requería cerrar el modal manualmente para volver a la lista

### Ahora ✨
- Al pasar el cursor sobre una notificación durante **400ms**, aparece **automáticamente** un popover a la **derecha**
- El popover muestra la información del donante (nombre, DNI, tipo de sangre)
- **Flecha indicadora** que señala desde el popover hacia la notificación de origen
- **Animación suave** de fade-in + slide-in (300ms de transición)
- El popover se cierra automáticamente cuando el cursor sale de la notificación
- Si mueves el cursor hacia el popover, este permanece abierto
- **Delay inteligente**: 400ms antes de mostrar (evita apariciones no deseadas con movimientos rápidos del cursor)

## 🎨 Características Técnicas

1. **Delay de Aparición**: 400ms de delay antes de mostrar el popover (evita apariciones accidentales)
2. **Posicionamiento Dinámico**: El popover se posiciona a la derecha de la notificación actual
3. **Smooth Transitions**: Animaciones suaves de entrada/salida (fade-in + slide-in, 300ms)
4. **Indicador Visual**: Flecha triangular que apunta desde el popover hacia la notificación
5. **Dark Mode Support**: Flecha con dos colores (light/dark) que cambia automáticamente
6. **Hover Persistente**: El popover permanece abierto si mueves el cursor sobre él
7. **Timeout Inteligente**: Delay de 150ms para evitar cierres accidentales
8. **Cancelación de Timeouts**: Sistema robusto que cancela timeouts pendientes para evitar comportamientos inesperados

## 📁 Archivos Modificados

- `src/components/features/notifications/NotificationsModal.tsx`
  - Estado `showPopover` para controlar la visibilidad del popover
  - Referencias `showTimeoutRef` y `hideTimeoutRef` para gestión de timeouts
  - Cambio de `onClick` a `onMouseEnter`/`onMouseLeave`
  - Sistema de posicionamiento absoluto para el popover
  - Elementos de flecha con soporte para modo claro y oscuro
  - Cálculo dinámico de posición basado en `getBoundingClientRect()`
  - Clases de transición controladas por estado

## 🔧 Mejoras Implementadas

```typescript
// Delay de aparición (400ms)
showTimeoutRef.current = window.setTimeout(() => {
    setShowPopover(true);
}, 400);

// Animación suave con transiciones CSS
className={`transition-all duration-300 ${
    showPopover 
        ? 'opacity-100 translate-x-0' 
        : 'opacity-0 -translate-x-4'
}`}

// Flecha indicadora (triángulo CSS)
<div 
    className={`absolute left-0 top-[10%] -translate-x-2 transition-opacity duration-300`}
    style={{ 
        width: 0, 
        height: 0,
        borderTop: '10px solid transparent',
        borderBottom: '10px solid transparent',
        borderRight: '10px solid',
        borderRightColor: 'rgb(229 231 235)', // Adapta al tema
    }}
/>
```

## 🎭 Detalles Visuales

### Flecha Indicadora
- **Tamaño**: 10px x 20px (triángulo)
- **Posición**: Borde izquierdo del popover, alineado al 10% desde arriba
- **Color Light Mode**: `gray-200` (#E5E7EB)
- **Color Dark Mode**: `gray-800` (#1F2937)
- **Animación**: Fade-in sincronizado con el popover (300ms)

### Transiciones
- **Delay de Aparición**: 400ms
- **Duración de Animación**: 300ms
- **Efectos**: opacity (0 → 100%) + translateX (-16px → 0px)
- **Timing Function**: ease (por defecto en Tailwind)

## 🚀 Cómo Probar

1. Abre el panel de notificaciones
2. **Mantén** el cursor sobre cualquier notificación que contenga información de donante durante ~400ms
3. El popover aparecerá suavemente a la derecha con una flecha apuntando a la notificación
4. Observa la animación de fade-in + slide-in
5. Mueve el cursor fuera de la notificación - el popover se desvanecerá
6. Mueve el cursor sobre el popover - permanecerá abierto para que puedas leerlo
7. Prueba movimientos rápidos del cursor - el popover no aparecerá (evita apariciones no deseadas)

## 📊 Métricas de UX

- **Tiempo de delay**: 400ms (óptimo para evitar "hover accidents")
- **Tiempo de animación**: 300ms (suficientemente suave, no demasiado lenta)
- **Tiempo de cierre**: 150ms (rápido pero permite transición al popover)

