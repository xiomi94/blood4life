# Plan de Refactorización: DashboardHospitalPage

## Objetivo

Dividir `DashboardHospitalPage.tsx` (955 líneas) en componentes más pequeños, mantenibles y reutilizables antes de proceder con la internacionalización.

## Análisis Actual

### Archivo Original
- **Ruta**: `e:\blood4life\frontend\src\pages\DashboardHospitalPage\DashboardHospitalPage.tsx`
- **Líneas**: 955
- **Problema**: Monolítico, difícil de mantener y de internacionalizar

## Componentes a Extraer

### 1. DashboardSidebar
**Ubicación**: `e:\blood4life\frontend\src\components\Dashboard\DashboardSidebar\DashboardSidebar.tsx`
- Navegación lateral
- Botón "Nueva campaña"
- Links de navegación (Inicio, Mis campañas, Noticias)
- **Líneas estimadas**: ~60 líneas

### 2. AppointmentsSection
**Ubicación**: `e:\blood4life\frontend\src\components\Dashboard\AppointmentsSection\AppointmentsSection.tsx`
- Sección "Citas programadas para hoy"
- Tarjetas de citas con información del donante
- **Líneas estimadas**: ~80 líneas
- **Props**: `appointments: AppointmentWithDonor[]`

### 3. StatsChartsSection
**Ubicación**: `e:\blood4life\frontend\src\components\Dashboard\StatsChartsSection\StatsChartsSection.tsx`
- Selector de tipo de gráfico
- Gráfico de barras (tipo de sangre)
- Gráfico de dona (género)
- Lista de campañas con búsqueda
- **Líneas estimadas**: ~200 líneas
- **Props**: `stats, selectedChart, onChartChange, campaigns, etc.`

### 4. CampaignsList
**Ubicación**: `e:\blood4life\frontend\src\components\Dashboard\CampaignsList\CampaignsList.tsx`
- Lista de campañas con scroll
- Búsqueda y filtrado
- Botones de edición y eliminación
- **Líneas estimadas**: ~120 líneas
- **Props**: `campaigns, searchTerm, onEdit, onDelete, etc.`

### 5. CalendarSection
**Ubicación**: `e:\blood4life\frontend\src\components\Dashboard\CalendarSection\CalendarSection.tsx`
- Calendario interactivo
- Vista de días/meses/años
- Indicadores de campañas
- **Líneas estimadas**: ~250 líneas
- **Props**: `campaigns, onDayClick, etc.`

### 6. DonationsHistorySection
**Ubicación**: `e:\blood4life\frontend\src\components\Dashboard\DonationsHistorySection\DonationsHistorySection.tsx`
- Historial de donaciones recibidas
- Tarjetas de donaciones
- **Líneas estimadas**: ~80 líneas

### 7. DeleteCampaignModal
**Ubicación**: `e:\blood4life\frontend\src\components\Modals\DeleteCampaignModal\DeleteCampaignModal.tsx`
- Modal de confirmación de eliminación
- Input de confirmación con nombre de campaña
- **Líneas estimadas**: ~60 líneas
- **Props**: `isOpen, campaign, onConfirm, onCancel, etc.`

## Estructura de Carpetas Propuesta

```
e:\blood4life\frontend\src\components\Dashboard\
├── DashboardSidebar\
│   ├── DashboardSidebar.tsx
│   └── DashboardSidebar.module.css
├── AppointmentsSection\
│   ├── AppointmentsSection.tsx
│   └── AppointmentsSection.module.css
├── StatsChartsSection\
│   ├── StatsChartsSection.tsx
│   └── StatsChartsSection.module.css
├── CampaignsList\
│   ├── CampaignsList.tsx
│   └── CampaignsList.module.css
├── CalendarSection\
│   ├── CalendarSection.tsx
│   └── CalendarSection.module.css
└── DonationsHistorySection\
    ├── DonationsHistorySection.tsx
    └── DonationsHistorySection.module.css
```

## Plan de Implementación

### Paso 1: Crear estructura de carpetas
- Crear carpetas para cada componente en `components/Dashboard/`

### Paso 2: Extraer componentes uno por uno
1. ✅ DashboardSidebar (más simple)
2. ✅ AppointmentsSection
3. ✅ DonationsHistorySection
4. ✅ CalendarSection (más complejo)
5. ✅ CampaignsList
6. ✅ StatsChartsSection
7. ✅ DeleteCampaignModal

### Paso 3: Actualizar DashboardHospitalPage
- Importar todos los componentes nuevos
- Reemplazar código con componentes
- Pasar props necesarios
- Mantener lógica de estado

### Paso 4: Verificación
- Compilar sin errores
- Probar funcionalidad completa del dashboard
- Verificar que todo funcione igual que antes

## Beneficios

1. **Mantenibilidad**: Cada componente tiene una responsabilidad clara
2. **Reutilización**: Componentes pueden usarse en otros dashboards
3. **Testeo**: Más fácil probar componentes individuales
4. **Internacionalización**: Más fácil traducir textos en componentes pequeños
5. **Legibilidad**: Código mucho más fácil de entender

## Estimación

- **Tiempo**: ~2-3 horas
- **Reducción de líneas en página principal**: De 955 a ~150-200 líneas
- **Total de componentes nuevos**: 7
