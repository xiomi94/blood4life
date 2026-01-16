# Documentación de Integración de API Externa (ISBT)

He documentado el proceso paso a paso que seguí para integrar la API de la "International Society of Blood Transfusion" (ISBT) en nuestra plataforma Blood4Life. El objetivo era ofrecer a nuestros usuarios información relevante y actualizada sobre los sistemas de grupos sanguíneos.

## 1. Análisis e Investigación de la API

Primero, investigué la disponibilidad de una API pública relacionada con la información sobre los grupos sanguíneos. Encontré la **ISBT 128 Standard**, que dispone de endpoints para consultar sistemas sanguíneos.

*   **Endpoint Principal:** `https://api-blooddatabase.isbtweb.org/api/systems`

## 2. Implementación del Servicio (`isbtService.ts`)

Para manejar la comunicación de manera robusta, creé un servicio dedicado en `frontend/src/services/isbtService.ts`.


```typescript
// Ejemplo de la lógica implementada
getSystems: async (): Promise<IsbtSystem[]> => {
    try {
        const response = await fetch('https://api-blooddatabase.isbtweb.org/api/systems');
    } catch (error) {
    }
}
```

## 3. Desarrollo del Componente Visual (`NewsModal.tsx`)

Quería que esta información no se sintiera como una simple tabla aburrida. Diseñé un componente modal con las siguientes características:

*   **Diseño Limpio**: Tarjetas individuales para cada sistema sanguíneo (ABO, RH, KELL, etc.).
*   **Interactividad**: Implementé una navegación interna dentro del modal. Al hacer clic en una tarjeta, la vista cambia a un **"Modo Detalle"**.
*   **Experiencia de Usuario**: Bloqueo del scroll del `body` cuando el modal está abierto para evitar scroll doble.
    

## 4. Integración en el Dashboard

Finalmente, integré este módulo en el flujo de trabajo tanto de Donantes como de Hospitales.

*   Modifiqué los Sidebars (`DonorSidebar.tsx` y `DashboardSidebar.tsx`).

## Resultado Final

Ahora, cuando un usuario accede a "Noticias", obtiene una experiencia educativa completa. Puede aprender que el sistema **ABO** es crítico para transfusiones o que el sistema **Kell** es el segundo más inmunogénico, todo sin salir de casa.
