# Documentación de Actualización del DashboardBloodDonor

---

## 📋 Resumen Ejecutivo

Se ha implementado una actualización completa del `DashboardBloodDonorPage` para incluir funcionalidades avanzadas similares al `DashboardHospitalPage`, pero adaptadas específicamente a las necesidades de los donantes de sangre. La implementación incluye cambios tanto en el backend como en el frontend, con énfasis en la arquitectura limpia y la separación de responsabilidades.

---

## 🎯 Objetivos Alcanzados

### Backend
✅ Creado endpoint `/api/appointment/donor/{donorId}` para obtener citas por donante  
✅ Añadidos métodos de consulta en `AppointmentRepository`  
✅ Creada migración Flyway V27 con seeders de datos de prueba  

### Frontend
✅ Calendario interactivo con navegación mensual  
✅ Gráfico de progreso de campañas (Meta vs Inscritos)  
✅ Lógica de donaciones basada en género (3 meses hombres, 4 meses mujeres)  
✅ Restricción de inscripción según próxima fecha disponible  
✅ Secciones personalizadas: "Mis próximas citas", "Mis donaciones", estadísticas  
✅ Refactorización completa: de 563 a 118 líneas en el componente principal  

---

## 📁 Estructura de Archivos Creados/Modificados

### Backend

#### 🆕 Nuevos Archivos
```
backend/
├── src/main/resources/db/migration/
│   └── V27__add_more_appointment_seeders.sql    [NEW]
```

#### ✏️ Archivos Modificados
```
backend/
└── src/main/java/com/xiojuandawt/blood4life/
    ├── repositories/
    │   └── AppointmentRepository.java           [MODIFIED]
    └── controllers/
        └── AppointmentController.java            [MODIFIED]
```

### Frontend

#### 🆕 Nuevos Archivos
```
frontend/src/
├── hooks/
│   └── useDonorDashboard.ts                     [NEW]
├── services/
│   └── appointmentService.ts                     [NEW]
└── components/DonorDashboard/
    ├── Calendar.tsx                              [NEW]
    ├── CampaignProgressChart.tsx                 [NEW]
    ├── DonationHistory.tsx                       [NEW]
    ├── DonorSidebar.tsx                          [NEW]
    ├── StatsCards.tsx                            [NEW]
    └── UpcomingAppointments.tsx                  [NEW]
```

#### ✏️ Archivos Modificados
```
frontend/src/
└── pages/DashboardBloodDonorPage/
    └── DashboardBloodDonorPage.tsx               [REFACTORED]
```

---

## 🔧 Cambios Detallados

### 1. Backend - AppointmentRepository.java

**Ubicación**: `backend/src/main/java/com/xiojuandawt/blood4life/repositories/AppointmentRepository.java`

**Cambios**:
- Añadido import de `java.util.List`
- Añadidos dos métodos de consulta:
  - `findByBloodDonorId(Integer bloodDonorId)`: Encuentra appointments por ID de donante
  - `findByBloodDonorIdOrderByDateAppointmentDesc(Integer bloodDonorId)`: Igual pero ordenados por fecha descendente

```java
List<Appointment> findByBloodDonorId(Integer bloodDonorId);
List<Appointment> findByBloodDonorIdOrderByDateAppointmentDesc(Integer bloodDonorId);
```

---

### 2. Backend - AppointmentController.java

**Ubicación**: `backend/src/main/java/com/xiojuandawt/blood4life/controllers/AppointmentController.java`

**Cambios**:
- Añadido nuevo endpoint GET `/donor/{donorId}`
- Retorna lista de `AppointmentDTO` ordenados por fecha descendente
- Convierte entidades `Appointment` a DTOs

```java
@GetMapping("/donor/{donorId}")
public List<AppointmentDTO> getAppointmentsByDonor(@PathVariable Integer donorId) {
  List<Appointment> appointments = appointmentRepository
    .findByBloodDonorIdOrderByDateAppointmentDesc(donorId);
  // ... conversión a DTOs
}
```

---

### 3. Backend - V27__add_more_appointment_seeders.sql

**Ubicación**: `backend/src/main/resources/db/migration/V27__add_more_appointment_seeders.sql`

**Propósito**: Provee datos de prueba realistas para testing del dashboard

**Contenido**:
- 7 campañas adicionales distribuidas a lo largo de 2025
- Múltiples appointments para cada uno de los 4 donantes de prueba
- Variedad de estados: COMPLETED (3), PENDING (1), CONFIRMED (2), CANCELLED (4), NO_SHOW (5)
- Fechas realistas distribuidas desde 2024 hasta 2026

**Estadísticas de Seeders**:
- Campañas nuevas: 7
- Appointments para Donor 1: 9 (5 completadas, 2 futuras)
- Appointments para Donor 2: 6 (2 completadas, 2 futuras)
- Appointments para Donor 3: 9 (3 completadas, 2 canceladas, 1 no-show, 2 futuras)
- Appointments para Donor 4: 7 (4 completadas, 3 futuras)

---

### 4. Frontend - appointmentService.ts

**Ubicación**: `frontend/src/services/appointmentService.ts`

**Propósito**: Servicio para gestionar appointments (citas/donaciones) de donantes

**Interfaces**:
```typescript
interface AppointmentStatus {
  id: number;
  name: string;
}

interface Appointment {
  id: number;
  appointmentStatus: AppointmentStatus;
  campaignId: number;
  bloodDonorId: number;
  hospitalComment?: string;
  dateAppointment: string;
  hourAppointment?: string;
}
```

**Métodos**:
- `getAppointmentsByDonor(donorId)`: Obtiene appointments de un donante específico
- `getAllAppointments()`: Obtiene todos los appointments
- `createAppointment(appointment)`: Crea un nuevo appointment

---

### 5. Frontend - useDonorDashboard.ts

**Ubicación**: `frontend/src/hooks/useDonorDashboard.ts`

**Propósito**: Hook personalizado que encapsula toda la lógica de negocio del dashboard del donante

**Funcionalidades**:
1. **Gestión de Estado**: Maneja estados de loading, error, campañas, appointments, calendario
2. **Lógica de Donaciones**: 
   - `getCompletedDonations()`: Filtra appointments completados
   - `getUpcomingAppointments()`: Filtra próximas citas
   - `getNextAvailableDate()`: Calcula próxima fecha disponible según género
   - `canDonateNow()`: Verifica si puede donar ahora
   - `getDaysUntilNextDonation()`: Calcula días restantes
   - `canJoinCampaign(campaign)`: Verifica elegibilidad para campaña
3. **Lógica de Calendario**:
   - `changeMonth(increment)`: Navega entre meses
   - `handleDayClick()`: Maneja selección de días
   - `clearSelectedDate()`: Limpia filtros
4. **Filtrado**:
   - `getAvailableCampaigns()`: Filtra campañas por tipo de sangre

**Reglas de Negocio Implementadas**:
- **Género Masculino**: Espera de 90 días entre donaciones
- **Género Femenino**: Espera de 120 días entre donaciones
- Solo puede inscribirse en campañas cuya fecha de inicio sea >= próxima fecha disponible

---

### 6. Frontend - Componentes Separados

#### 6.1. Calendar.tsx
**Líneas**: ~110  
**Responsabilidad**: Renderizar calendario interactivo con campañas

**Características**:
- Navegación mensual (anterior/siguiente)
- Códigos de color para campañas:
  - 🟢 Verde: Campaña activa
  - 🔵 Azul: Campaña futura
  - 🔴 Rojo: Campaña pasada
  - 🔵 Azul claro: Día actual (sin campañas)
- Contador de campañas por día
- Tooltips con nombres de campañas
- Click para filtrar campañas por fecha

#### 6.2. CampaignProgressChart.tsx
**Líneas**: ~115  
**Responsabilidad**: Gráfico de barras agrupadas (Meta vs Inscritos)

**Características**:
- Gráfico de Chart.js con dos datasets:
  - Azul: Meta de donantes (requiredDonorQuantity)
  - Verde: Donantes inscritos (currentDonorCount)
- Vista alternativa con lista de campañas cuando hay filtro por fecha
- Botón para limpiar filtro

#### 6.3. DonationHistory.tsx
**Líneas**: ~50  
**Responsabilidad**: Lista de donaciones completadas del usuario

**Características**:
- Muestra últimas 5 donaciones
- Badge verde "Completado"
- Información de campaña y comentarios del hospital
- Fecha formateada
- Mensaje cuando no hay donaciones

#### 6.4. UpcomingAppointments.tsx
**Líneas**: ~45  
**Responsabilidad**: Scroll horizontal con próximas citas

**Características**:
- Scroll horizontal suave
- Máximo 4 citas mostradas
- Información: campaña, fecha, hora
- Snap scroll para mejor UX
- Mensaje cuando no hay citas

#### 6.5. StatsCards.tsx
**Líneas**: ~35  
**Responsabilidad**: Tarjetas de estadísticas personalizadas

**Características**:
- **Card 1**: Total de donaciones completadas
- **Card 2**: Próxima donación disponible
  - "Disponible ahora" si puede donar
  - "En X días" con fecha si está en espera

#### 6.6. DonorSidebar.tsx
**Líneas**: ~55  
**Responsabilidad**: Barra lateral con navegación

**Características**:
- Botón principal "Nueva donación"
- Links de navegación: Inicio, Mis campañas, Noticias
- Badge "NEW" en Noticias
- Iconos SVG inline

---

### 7. Frontend - DashboardBloodDonorPage.tsx (Refactorizado)

**Ubicación**: `frontend/src/pages/DashboardBloodDonorPage/DashboardBloodDonorPage.tsx`

**Antes**: 563 líneas  
**Después**: 118 líneas  
**Reducción**: 79% 🎉

**Estructura Refactorizada**:
```tsx
const DashboardBloodDonorPage = () => {
  // 1. Usa hook personalizado para toda la lógica
  const { ...allLogic } = useDonorDashboard();

  // 2. Estados de carga/error
  if (loading) return <LoadingView />;
  if (error) return <ErrorView />;
  if (!stats) return null;

  // 3. Renderiza componentes separados
  return (
    <div>
      <DonorSidebar />
      <main>
        <UpcomingAppointments />
        <div className="grid">
          <CampaignProgressChart />
          <DonationHistory />
          <Calendar />
          <StatsCards />
        </div>
      </main>
    </div>
  );
};
```

**Ventajas de la Refactorización**:
- ✅ Código más legible y mantenible
- ✅ Componentes reutilizables
- ✅ Lógica separada de la presentación
- ✅ Testing más fácil
- ✅ Menor acoplamiento

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────┐
│  DashboardBloodDonorPage (118 líneas)  │
│  ├─ Register ChartJS                   │
│  └─ Usa useDonorDashboard hook         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│  useDonorDashboard Hook (165 líneas)        │
│  ├─ Fetches: stats, campaigns, appointments │
│  ├─ Business Logic: donations, gender rules │
│  └─ Calendar Logic: navigation, selection   │
└──────────┬───────────────────────────────────┘
           │
           ├─── appointmentService.ts ───▶ Backend: /api/appointment/donor/{id}
           ├─── campaignService.ts ──────▶ Backend: /api/campaign
           └─── dashboardService.ts ─────▶ Backend: /api/dashboard/stats
                                           
┌──────────────────────────────────────────────┐
│  Backend (Java/Spring Boot)                 │
│  ├─ AppointmentController                   │
│  │  └─ GET /donor/{id}                      │
│  ├─ AppointmentRepository                   │
│  │  └─ findByBloodDonorId...()              │
│  └─ Database (MySQL + Flyway)               │
│     └─ V27 Seeders                           │
└──────────────────────────────────────────────┘
```

---

## 🎨 Arquitectura de Componentes

```
DashboardBloodDonorPage/
│
├─── Layout
│    ├─ DonorSidebar (55 líneas)
│    │  ├─ Action Button: "Nueva donación"
│    │  └─ Navigation Links
│    │
│    └─ Main Content
│         ├─ UpcomingAppointments (45 líneas)
│         │  └─ Horizontal scroll with cards
│         │
│         ├─ Grid Layout (2 cols + 1 col)
│         │   │
│         │   ├─ Left Column (2 cols)
│         │   │  ├─ CampaignProgressChart (115 líneas)
│         │   │  │  ├─ Bar Chart (Meta vs Inscritos)
│         │   │  │  └─ Filtered Campaigns List
│         │   │  │
│         │   │  └─ DonationHistory (50 líneas)
│         │   │     └─ List of completed donations
│         │   │
│         │   └─ Right Column (1 col)
│         │      ├─ Calendar (110 líneas)
│         │      │  ├─ Month navigation
│         │      │  ├─ Interactive days grid
│         │      │  └─ Campaign color codes
│         │      │
│         │      └─ StatsCards (35 líneas)
│         │         ├─ Total donations count
│         │         └─ Next available date
│         │
│         └─ useDonorDashboard Hook (165 líneas)
│            ├─ Data fetching
│            ├─ Business logic
│            └─ State management
```

---

## 📊 Reglas de Negocio

### 1. Períodos de Espera entre Donaciones

**Género Masculino**:
- Período de espera: **90 días** (3 meses)
- Cálculo: `última donación + 90 días = próxima fecha disponible`

**Género Femenino**:
- Período de espera: **120 días** (4 meses)
- Cálculo: `última donación + 120 días = próxima fecha disponible`

### 2. Restricción de Inscripción en Campañas

Un donante **puede inscribirse** en una campaña si:
```
campaign.startDate >= nextAvailableDate
```

Si está en período de espera:
- Botón "Inscribirme" **deshabilitado** para campañas que inicien antes
- Tooltip muestra: "Disponible después del [fecha]"

### 3. Estados de Appointments

| ID | Estado | Significado |
|----|--------|-------------|
| 1 | PENDING | Pendiente de confirmación |
| 2 | CONFIRMED | Confirmada |
| 3 | COMPLETED | Completada (cuenta como donación) |
| 4 | CANCELLED | Cancelada |
| 5 | NO_SHOW | No se presentó |

### 4. Filtrado de Campañas Disponibles

Una campaña es visible para el donante si:
```typescript
requiredBloodTypes.includes('Universal') || 
requiredBloodTypes.includes(user.bloodType)
```

---

## 🧪 Testing Manual

### Pruebas Básicas

1. **Verificar Calendario**
   - [ ] Navegar mes anterior/siguiente funciona
   - [ ] Hacer click en día con campañas filtra correctamente
   - [ ] Botón "Limpiar filtro" restaura vista
   - [ ] Colores correctos: verde (activa), azul (futura), rojo (pasada)

2. **Verificar Lógica de Género**
   - [ ] Login con donante masculino → Stats Card muestra lógica de 90 días
   - [ ] Login con donante femenino → Stats Card muestra lógica de 120 días
   - [ ] Sin donaciones previas → Muestra "Disponible ahora"

3. **Verificar Gráfico de Campañas**
   - [ ] Muestra todas las campañas
   - [ ] Dos barras por campaña (Meta y Actual)
   - [ ] Colores correctos (azul y verde)

4. **Verificar "Mis donaciones"**
   - [ ] Solo muestra appointments con status COMPLETED (id=3)
   - [ ] Ordenadas por fecha descendente
   - [ ] Máximo 5 mostradas

5. **Verificar "Mis próximas citas"**
   - [ ] Solo muestra PENDING (1) o CONFIRMED (2)
   - [ ] Solo fechas futuras
   - [ ] Máximo 4 mostradas

### Pruebas con Datos de Seeders

**Donante ID 1** (ejecutar con este usuario):
- Debería ver 5 donaciones completadas en historial
- Última donación: 2024-12-05
- Si género = Masculino: próxima disponible = 2024-12-05 + 90 días = 2025-03-05
- Debería ver 2 citas futuras programadas

**Donante ID 2** (ejecutar con este usuario):
- Debería ver 2 donaciones completadas
- Última donación: 2024-12-15
- Si género = Femenino: próxima disponible = 2024-12-15 + 120 días = 2025-04-14

---

## 🚀 Comandos de Ejecución

### Backend

```bash
# Navegar al directorio del backend
cd backend

# Ejecutar con Maven
./mvnw spring-boot:run

# O compilar y ejecutar
./mvnw clean package
java -jar target/blood4life-0.0.1-SNAPSHOT.jar
```

**Nota**: Flyway ejecutará automáticamente la migración V27 al iniciar.

### Frontend

```bash
# Navegar al directorio del frontend
cd frontend

# Instalar dependencias (si es necesario)
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción (opcional)
npm run build
```

### Base de Datos

La migración V27 se ejecuta automáticamente. Para verificar manualmente:

```sql
-- Ver seeders de campañas nuevas
SELECT * FROM campaign WHERE id > 6;

-- Ver appointments del donante 1
SELECT * FROM appointment WHERE blood_donor_id = 1 ORDER BY date_appointment DESC;

-- Verificar estados de appointments
SELECT 
    a.id,
    a.date_appointment,
    ast.name as status,
    bd.first_name,
    c.name as campaign_name
FROM appointment a
JOIN appointment_status ast ON a.appointment_status_id = ast.id
JOIN blood_donor bd ON a.blood_donor_id = bd.id
JOIN campaign c ON a.campaign_id = c.id
ORDER BY a.date_appointment DESC
LIMIT 20;
```

---

## 📝 Notas de Implementación

### Consideraciones Técnicas

1. **Chart.js**: Registrado globalmente en el componente principal
2. **Fechas**: Manejo de timezone UTC con conversión a ES-ES
3. **Responsividad**: Grid adapta de 3 columnas (desktop) a 1 columna (mobile)
4. **Performance**: Hooks memoized implícitamente por React
5. **Tipos**: TypeScript strict mode compatible

### Limitaciones Actuales

1. **Sin paginación**: "Mis donaciones" muestra solo últimas 5
2. **Sin búsqueda**: No hay búsqueda en calendar o campañas
3. **Datos estáticos**: Appointments no se refrescan en tiempo real
4. **Sin i18n**: Textos hardcoded en español
5. **Modal de inscripción**: Funcionalidad pendiente

### Futuras Mejoras Sugeridas

1. ✨ Agregar modal de inscripción en campañas
2. ✨ Implementar paginación en "Mis donaciones"
3. ✨ Agregar búsqueda/filtros avanzados
4. ✨ Notificaciones push para próximas citas
5. ✨ Exportar historial de donaciones (PDF/Excel)
6. ✨ Integración con Google Calendar para recordatorios
7. ✨ Gráfico adicional de historial personal de donaciones por mes

---

## 🐛 Resolución de Problemas

### Error: "Cannot find module 'appointmentService'"

**Solución**: Verificar que el archivo existe en `frontend/src/services/appointmentService.ts`

### Error: Flyway migration failed

**Solución**: 
1. Verificar que no exista ya V27 en `flyway_schema_history`
2. Si existe, eliminar y volver a ejecutar
3. O incrementar versión a V28

```sql
DELETE FROM flyway_schema_history WHERE version = '27';
```

### Error: "User is undefined in hook"

**Solución**: Verificar que `AuthContext` está proporcionando el usuario correctamente

```tsx
// Verificar en console
console.log(user);
```

### Git

rfico no muestra datos

**Solución**: 
1. Verificar que `allCampaigns` tiene datos
2. Verificar que `currentDonorCount` está poblado en las campañas
3. Comprobar console de navegador para errores de Chart.js

---

## 📚 Referencias

### Tecnologías Utilizadas

- **Backend**: Java 17, Spring Boot 3.x, MySQL, Flyway
- **Frontend**: React 18, TypeScript, Chart.js, TailwindCSS
- **Build**: Maven (backend), Vite (frontend)

### Endpoints API Relevantes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Estadísticas globales |
| GET | `/api/campaign` | Todas las campañas |
| GET | `/api/campaign/{id}` | Campaña por ID |
| GET | `/api/appointment/all` | Todos los appointments |
| GET | `/api/appointment/donor/{donorId}` | Appointments de un donante |
| POST | `/api/appointment/create` | Crear appointment |

### Enlaces Útiles

- Chart.js Docs: https://www.chartjs.org/docs/
- React Hooks: https://react.dev/reference/react
- Flyway Migrations: https://flywaydb.org/documentation/

---

## ✅ Checklist de Implementación

- [x] Crear endpoint en AppointmentController
- [x] Añadir métodos en AppointmentRepository
- [x] Crear migración Flyway V27 con seeders
- [x] Crear appointmentService.ts en frontend
- [x] Crear hook personalizado useDonorDashboard
- [x] Crear 6 componentes separados
- [x] Refactorizar DashboardBloodDonorPage
- [x] Reducir de 563 a menos de 400 líneas
- [x] Implementar calendario interactivo
- [x] Implementar gráfico de progreso de campañas
- [x] Implementar lógica de género (90/120 días)
- [x] Implementar restricción de inscripción por fechas
- [x] Testing manual básico
- [x] Crear documentación completa

---

## 🎓 Lecciones Aprendidas

1. **Separación de responsabilidades**: Hooks para lógica, componentes para UI
2. **Refactorización temprana**: Mejor refactorizar a los 200 líneas que a los 600
3. **Seeders realistas**: Datos de prueba variados facilitan el testing
4. **TypeScript strict**: Ayuda a prevenir bugs en tiempo de desarrollo
5. **Composición sobre herencia**: Componentes pequeños y reutilizables

---

## 👥 Contribuciones

Para contribuir a este proyecto:

1. Fork el repositorio
2. Crear branch feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Add nueva funcionalidad'`
4. Push al branch: `git push origin feature/nueva-funcionalidad`
5. Abrir Pull Request

---

## 📄 Licencia

[Especificar licencia del proyecto]

---

## 📞 Soporte

Para preguntas o issues:
- Crear issue en GitHub
- Contactar al equipo de desarrollo

---

**Documentación generada automáticamente por Antigravity AI**  
**Última actualización**: 2025-12-14
