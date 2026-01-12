# Dashboard Internationalization - Implementation Plan

## Objetivo
Internacionalizar todos los textos estáticos del Dashboard Hospital en los 6 idiomas soportados: **ES** (español), **EN** (inglés), **DE** (alemán), **FR** (francés), **JA** (japonés), **ZH** (chino).

## Components a Internacionalizar

### 1. DashboardSidebar
**Textos identificados:**
- "Nueva campaña"
- "Inicio"
- "Mis campañas"
- "Noticias"
- "NEW" (badge)

**Translation Keys:**
```
dashboard.sidebar.newCampaign
dashboard.sidebar.home
dashboard.sidebar.myCampaigns
dashboard.sidebar.news
dashboard.sidebar.newBadge
```

---

### 2. AppointmentsSection
**Textos identificados:**
- "Citas programadas para hoy"
- "No hay citas programadas para hoy"
- "Donante desconocido"
- "Sin hora"
- "DNI:"

**Translation Keys:**
```
dashboard.appointments.title
dashboard.appointments.noAppointments
dashboard.appointments.unknownDonor
dashboard.appointments.noTime
dashboard.appointments.dniLabel
```

---

### 3. StatsChartsSection
**Textos identificados:**
- "Campañas seleccionadas"
- "Limpiar filtro"
- "Buscar por título o ubicación..."
- "Campañas"
- "Distribución por tipo de sangre"
- "Distribución por género"
- "No se encontraron campañas con ese criterio"
- "No hay campañas en esta fecha"
- "No hay campañas activas"

**Translation Keys:**
```
dashboard.stats.selectedCampaigns
dashboard.stats.clearFilter
dashboard.stats.searchPlaceholder
dashboard.stats.campaignsOption
dashboard.stats.bloodTypeOption
dashboard.stats.genderOption
dashboard.campaigns.noResults
dashboard.campaigns.noCampaignsOnDate
dashboard.campaigns.noCampaigns
```

---

### 4. CampaignsList
**Textos identificados:**
- "Meta: X/Y donantes"
- "Editar campaña"
- "Eliminar campaña"
- "Fechas:"
- "Tipos de sangre:"

**Translation Keys:**
```
dashboard.campaigns.goalLabel
dashboard.campaigns.editButton
dashboard.campaigns.deleteButton
dashboard.campaigns.datesLabel
dashboard.campaigns.bloodTypesLabel
```

---

### 5. CalendarSection
**Textos identificados:**
- "Calendario"
- Nombres de meses: "Enero", "Febrero", etc.
- Días: "Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"
- "Realizadas"
- "Activas"
- "Futuras"

**Translation Keys:**
```
dashboard.calendar.title
dashboard.calendar.months.january
dashboard.calendar.months.february
...
dashboard.calendar.days.monday
dashboard.calendar.days.tuesday
...
dashboard.calendar.legend.completed
dashboard.calendar.legend.active
dashboard.calendar.legend.upcoming
```

---

### 6. DonationsHistorySection
**Textos identificados:**
- "Donaciones recibidas"
- "Últimas donaciones de sangre recibidas en el hospital."
- "Campaña de donación"
- "Donación tipo O+"
- "Hospital Negrín"
- "Finalizado"

**Translation Keys:**
```
dashboard.donations.title
dashboard.donations.subtitle
dashboard.donations.campaignLabel
dashboard.donations.donationType
dashboard.donations.hospitalLabel
dashboard.donations.completed
```

---

### 7. DeleteCampaignModal
**Textos identificados:**
- "Eliminar Campaña"
- "¿Estás seguro de que deseas eliminar esta campaña?"
- "Esta acción no se puede deshacer."
- "Para confirmar, escribe el nombre de la campaña:"
- "Nombre de la campaña..."
- "Cancelar"
- "Eliminar"

**Translation Keys:**
```
dashboard.modal.delete.title
dashboard.modal.delete.confirmMessage
dashboard.modal.delete.warning
dashboard.modal.delete.instructionsLabel
dashboard.modal.delete.placeholder
common.cancel
common.delete
```

---

### 8. Main DashboardHospitalPage
**Textos identificados:**
- "Cargando estadísticas..."
- "Error al cargar las estadísticas"
- "Citas hoy"
- "Donaciones este mes"

**Translation Keys:**
```
dashboard.loading
dashboard.loadError
dashboard.stats.appointmentsToday
dashboard.stats.donationsThisMonth
```

---

## Estructura JSON Propuesta

```json
{
  "dashboard": {
    "loading": "...",
    "loadError": "...",
    "sidebar": {
      "newCampaign": "...",
      "home": "...",
      "myCampaigns": "...",
      "news": "...",
      "newBadge": "..."
    },
    "appointments": {
      "title": "...",
      "noAppointments": "...",
      "unknownDonor": "...",
      "noTime": "...",
      "dniLabel": "..."
    },
    "stats": {
      "selectedCampaigns": "...",
      "clearFilter": "...",
      "searchPlaceholder": "...",
      "campaignsOption": "...",
      "bloodTypeOption": "...",
      "genderOption": "...",
      "appointmentsToday": "...",
      "donationsThisMonth": "..."
    },
    "campaigns": {
      "goalLabel": "...",
      "editButton": "...",
      "deleteButton": "...",
      "datesLabel": "...",
      "bloodTypesLabel": "...",
      "noResults": "...",
      "noCampaignsOnDate": "...",
      "noCampaigns": "..."
    },
    "calendar": {
      "title": "...",
      "months": {
        "january": "...",
        "february": "...",
        ...
      },
      "days": {
        "monday": "...",
        "tuesday": "...",
        ...
      },
      "legend": {
        "completed": "...",
        "active": "...",
        "upcoming": "..."
      }
    },
    "donations": {
      "title": "...",
      "subtitle": "...",
      "campaignLabel": "...",
      "donationType": "...",
      "hospitalLabel": "...",
      "completed": "..."
    },
    "modal": {
      "delete": {
        "title": "...",
        "confirmMessage": "...",
        "warning": "...",
        "instructionsLabel": "...",
        "placeholder": "..."
      }
    }
  }
}
```

---

## Orden de Implementación

### Fase 1: Agregar Traducciones (6 archivos)
1. **ES** - Español (referencia base)
2. **EN** - Inglés
3. **DE** - Alemán  
4. **FR** - Francés
5. **JA** - Japonés
6. **ZH** - Chino

### Fase 2: Actualizar Componentes (7 componentes)
1. `DashboardSidebar.tsx`
2. `AppointmentsSection.tsx`
3. `StatsChartsSection.tsx`
4. `CampaignsList.tsx`
5. `CalendarSection.tsx`
6. `DonationsHistorySection.tsx`
7. `DeleteCampaignModal.tsx`
8. `DashboardHospitalPage.tsx`

### Fase 3: Verificación
- Browser testing con cambio de idioma
- Verificar todos los textos en cada idioma
- Screenshots de evidencia

---

## Notas Importantes

- Usar `useTranslation` hook: `const { t } = useTranslation();`
- Claves con sintaxis punto: `t('dashboard.sidebar.newCampaign')`
- Mantener coherencia con claves existentes
- Fechas y números mantener formato locale-aware
