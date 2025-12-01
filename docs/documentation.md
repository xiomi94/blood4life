# Blood4Life - Documentación Completa del Proyecto

## Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Base de Datos](#base-de-datos)
5. [Backend - API REST](#backend---api-rest)
6. [Frontend - Interfaz de Usuario](#frontend---interfaz-de-usuario)
7. [Configuración y Despliegue](#configuración-y-despliegue)
8. [Flujos de Usuario](#flujos-de-usuario)
9. [Seguridad](#seguridad)

---

## Descripción General

Blood4Life es una aplicación web para la gestión de donaciones de sangre que conecta hospitales con donantes. La plataforma permite:

- **Registro y autenticación** de hospitales y donantes de sangre
- **Gestión de campañas** de donación de sangre por parte de hospitales
- **Sistema de citas** para coordinar donaciones
- **Dashboards estadísticos** con visualización de datos
- **Gestión de perfiles** con imágenes

### Usuarios del Sistema
1. **Donantes de Sangre**: Pueden registrarse, iniciar sesión y gestionar sus donaciones
2. **Hospitales**: Pueden crear campañas, gestionar citas y ver estadísticas
3. **Administradores**: Gestión completa del sistema

---

## Tecnologías Utilizadas

### Backend
- **Framework**: Spring Boot 3.x
- **Lenguaje**: Java 17+
- **Base de Datos**: MySQL 8.x
- **ORM**: Spring Data JPA / Hibernate
- **Seguridad**: Spring Security con JWT
- **Migr

aciones**: Flyway
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18+ con TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Estilos**: Tailwind CSS
- **Gráficos**: Chart.js + react-chartjs-2
- **HTTP Client**: Axios

### Infraestructura
- **Servidor de Desarrollo**: Puerto 8080 (backend), Puerto 5173 (frontend)
- **Proxy**: Vite proxy para redirigir `/api` al backend
- **Almacenamiento de Imágenes**: Sistema de archivos local (`uploads/`)

---

## Arquitectura del Sistema

### Patrón Arquitectónico
El proyecto sigue una arquitectura **Cliente-Servidor** con separación frontend-backend:

```
┌─────────────────┐          ┌──────────────────┐         ┌──────────────┐
│                 │   HTTP   │                  │  JDBC   │              │
│  React Frontend │ ────────▶│  Spring Boot API │────────▶│    MySQL     │
│   (Port 5173)   │◀──────── │   (Port 8080)    │◀────────│   Database   │
└─────────────────┘   JSON   └──────────────────┘         └──────────────┘
```

### Capas del Backend
1. **Controllers**: Manejo de peticiones HTTP y respuestas
2. **Services**: Lógica de negocio
3. **Repositories**: Acceso a datos (Spring Data JPA)
4. **Entities**: Modelos de datos (JPA Entities)
5. **DTOs**: Objetos de transferencia de datos
6. **Config**: Configuración de seguridad, CORS, JWT

### Estructura Frontend
1. **Pages**: Componentes de página completa
2. **Components**: Componentes reutilizables
3. **Services**: Comunicación con API
4. **Context**: Gestión de estado global (AuthContext)
5. **Utils**: Utilidades y helpers

---

## Base de Datos

### Esquema de Tablas

#### 1. `blood_donor`
Almacena información de donantes de sangre.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| dni | VARCHAR(20) | DNI del donante |
| first_name | VARCHAR(100) | Nombre |
| last_name | VARCHAR(100) | Apellidos |
| gender | VARCHAR(20) | Género |
| blood_type_id | INT (FK) | Referencia a tipo de sangre |
| email | VARCHAR(100) | Email (único) |
| phone_number | VARCHAR(20) | Teléfono |
| date_of_birth | DATE | Fecha de nacimiento |
| password | VARCHAR(255) | Contraseña hasheada (BCrypt) |
| image_id | BIGINT (FK) | Referencia a imagen de perfil |

#### 2. `hospital`
Almacena información de hospitales.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| cif | VARCHAR(20) | CIF del hospital |
| name | VARCHAR(255) | Nombre del hospital |
| address | VARCHAR(255) | Dirección |
| email | VARCHAR(100) | Email (único) |
| phone_number | VARCHAR(20) | Teléfono |
| password | VARCHAR(255) | Contraseña hasheada |
| image_id | BIGINT (FK) | Logo del hospital |

#### 3. `campaign`
Campañas de donación organizadas por hospitales.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| hospital_id | INT (FK) | Hospital organizador |
| name | VARCHAR(255) | Nombre de la campaña |
| description | VARCHAR(500) | Descripción |
| start_date | DATE | Fecha de inicio |
| end_date | DATE | Fecha de fin |
| location | VARCHAR(255) | Ubicación |
| required_donor_quantity | INT | Cantidad de donantes requeridos |
| required_blood_type | VARCHAR(50) | Tipo de sangre requerido |

#### 4. `appointment`
Citas para donación de sangre.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT (PK) | Identificador único |
| appointment_status_id | BIGINT (FK) | Estado de la cita |
| campaign_id | INT (FK) | Campaña asociada |
| blood_donor_id | INT (FK) | Donante |
| hospital_comment | VARCHAR(255) | Comentarios del hospital |
| date_appointment | DATE | Fecha de la cita |
| hour_appointment | TIME | Hora de la cita |

#### 5. `appointment_status`
Catálogo de estados de citas.

| Campo | Tipo | Valores |
|-------|------|---------|
| id | BIGINT (PK) | AUTO_INCREMENT |
| status_name | VARCHAR(50) | PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW |
| description | VARCHAR(255) | Descripción del estado |

#### 6. `blood_type`
Catálogo de tipos de sangre.

| Campo | Tipo | Valores |
|-------|------|---------|
| id | INT (PK) | AUTO_INCREMENT |
| blood_name | VARCHAR(10) | A+, A-, B+, B-, AB+, AB-, O+, O- |

#### 7. `image`
Almacenamiento de metadatos de imágenes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT (PK) | Identificador único |
| name | VARCHAR(255) | Nombre del archivo (UUID + extensión) |

#### 8. `admin`
Usuarios administradores del sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT (PK) | Identificador único |
| username | VARCHAR(100) | Nombre de usuario |
| password | VARCHAR(255) | Contraseña hasheada |

#### 9. `blood_type_campaign`
Tabla intermedia para relación N:M entre campañas y tipos de sangre.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| blood_type | INT (FK) | Tipo de sangre |
| campaign | INT (FK) | Campaña |

### Relaciones
- `blood_donor` → `blood_type` (N:1)
- `blood_donor` → `image` (N:1)
- `hospital` → `image` (N:1)
- `campaign` → `hospital` (N:1)
- `campaign` ↔ `blood_type` (N:M) via `blood_type_campaign`
- `appointment` → `campaign` (N:1)
- `appointment` → `blood_donor` (N:1)
- `appointment` → `appointment_status` (N:1)

---

## Backend - API REST

### Endpoints de Autenticación

#### POST `/api/auth/bloodDonor/register`
Registro de nuevo donante de sangre.

**Request (multipart/form-data)**:
```
dni: string
firstName: string
lastName: string
gender: string
bloodTypeId: integer
email: string
phoneNumber: string (opcional)
dateOfBirth: date (opcional)
password: string
image: file (opcional)
```

**Response 201**:
```json
{
  "id": 1,
  "dni": "12345678A",
  "firstName": "Juan",
  "lastName": "Pérez",
  "gender": "Masculino",
  "bloodType": { "id": 1, "bloodName": "A+" },
  "email": "juan@example.com",
  "phoneNumber": "612345678",
  "dateOfBirth": "1990-01-01",
  "imageName": "uuid-image.jpg"
}
```

#### POST `/api/auth/bloodDonor/login`
Login de donante.

**Request Headers**:
```
Authorization: Basic base64(email:password)
```

**Response 200**:
```json
{
  "status": "OK",
  "message": "Login con éxito"
}
```
**Cookies**: `jwt` (HttpOnly, 24h de expiración)

#### POST `/api/auth/hospital/register`
Registro de hospital.

**Request (multipart/form-data)**:
```
cif: string
name: string
address: string
email: string
phoneNumber: string
password: string
image: file (opcional)
```

**Response 201**:
```json
{
  "id": 1,
  "cif": "H12345678",
  "name": "Hospital General",
  "address": "Calle Principal 123",
  "email": "hospital@example.com",
  "phoneNumber": "911234567",
  "imageName": "uuid-logo.jpg"
}
```

#### POST `/api/auth/hospital/login`
Login de hospital.

**Request Headers**:
```
Authorization: Basic base64(email:password)
```

**Response 200**:
```json
{
  "status": "OK",
  "message": "Login successful"
}
```
**Cookies**: `jwt` (HttpOnly, 24h)

### Endpoints de Dashboard

#### GET `/api/dashboard/stats`
Obtiene estadísticas generales para el dashboard público.

**Response 200**:
```json
{
  "bloodType": {
    "labels": ["A+", "A-", "B+", "O+"],
    "counts": [15, 8, 12, 20]
  },
  "gender": {
    "labels": ["Masculino", "Femenino"],
    "counts": [30, 25]
  }
}
```

#### GET `/api/dashboard/hospital/appointments`
Obtiene citas de un hospital en un rango de fechas (requiere autenticación).

**Request Params**:
```
startDate: date (YYYY-MM-DD)
endDate: date (YYYY-MM-DD)
```

**Response 200**:
```json
[
  {
    "id": 1,
    "appointmentStatus": { "id": 3, "statusName": "COMPLETED" },
    "campaign": { "id": 1, "name": "Campaña Invierno" },
    "bloodDonor": { "id": 1, "firstName": "Juan", "lastName": "Pérez" },
    "hospitalComment": "Todo correcto",
    "dateAppointment": "2025-01-10",
    "hourAppointment": "09:00:00"
  }
]
```

### Endpoints de Hospitales

#### GET `/api/hospital`
Lista todos los hospitales.

**Response 200**:
```json
[
  {
    "id": 1,
    "cif": "H12345678",
    "name": "Hospital General",
    "address": "Calle Principal 123",
    "email": "hospital@example.com",
    "phoneNumber": "911234567",
    "imageName": "uuid-logo.jpg"
  }
]
```

#### GET `/api/hospital/me`
Obtiene los datos del hospital autenticado.

**Response 200**:
```json
{
  "id": 1,
  "cif": "H12345678",
  "name": "Hospital General",
  "address": "Calle Principal 123",
  "email": "hospital@example.com",
  "phoneNumber": "911234567",
  "imageName": "uuid-logo.jpg"
}
```

#### POST `/api/hospital`
Crea un nuevo hospital.

#### PUT `/api/hospital`
Actualiza un hospital existente.

#### DELETE `/api/hospital/{id}`
Elimina un hospital.

### Endpoints de Imágenes

#### GET `/api/images/{imageName}`
Sirve una imagen almacenada.

**Response 200**: Bytes de la imagen con Content-Type apropiado (image/png, image/jpeg)

#### POST `/api/images/upload`
Sube una nueva imagen.

**Request (multipart/form-data)**:
```
image: file
```

**Response 200**:
```json
{
  "message": "Imagen subida exitosamente",
  "id": 1,
  "filename": "uuid-image.jpg",
  "url": "/api/images/uuid-image.jpg"
}
```

---

## Frontend - Interfaz de Usuario

### Estructura de Componentes

#### Páginas (`/src/pages/`)

1. **`HomePage`**
   - Página de inicio
   - Presenta la aplicación
   - Enlaces a registro y login

2. **`Login`**
   - Formulario de inicio de sesión
   - Selector de tipo de usuario (Donante/Hospital)
   - Redirección según tipo de usuario

3. **`HospitalRegisterPage`**
   - Formulario de registro de hospitales
   - Validación exhaustiva de campos
   - Subida de imagen de perfil (obligatoria)
   - Redirección a login tras registro exitoso

4. **`DashboardPage`**
   - Dashboard público con estadísticas generales
   - Gráficos de distribución por tipo de sangre y género
   - Implementado con Chart.js

5. **`DashboardHospitalPage`**
   - Dashboard específico para hospitales autenticados
   - Visualización de estadísticas
   - Perfil de usuario con foto
   - Menú desplegable con opción de logout

#### Componentes Reutilizables (`/src/components/`)

1. **`Header`**
   - Navegación principal
   - Logo y enlaces
   - Botones de login/registro
   - Responsive con hamburger menu

2. **`Footer`**
   - Información de contacto
   - Enlaces legales

3. **`LoginForm`**
   - Formulario de login
   - Selector de tipo de usuario
   - Manejo de errores
   - Integración con AuthContext

4. **`FormField`**
   - Campo de formulario reutilizable
   - Con validación y mensajes de error
   - Soporte para toggle de contraseña

5. **`Button`**
   - Botón estilizado reutilizable
   - Estados: normal, hover, disabled

6. **`ImageUpload`**
   - Componente para subida de imágenes
   - Previsualización instantánea
   - Validación de tipo y tamaño (JPG/PNG, max 5MB)

### Servicios (`/src/services/`)

#### `authService.ts`
```typescript
interface AuthService {
  login(email: string, password: string, userType: string): Promise<any>;
  registerHospital(formData: FormData): Promise<any>;
}
```

#### `dashboardService.ts`
```typescript
interface DashboardService {
  getStats(): Promise<DashboardStats>;
  getHospitalAppointments(startDate: string, endDate: string): Promise<any[]>;
}
```

### Contexto de Autenticación

#### `AuthContext.tsx`
Maneja el estado global de autenticación:

```typescript
interface AuthContextType {
  userType: 'bloodDonor' | 'hospital' | 'admin' | null;
  user: any | null;
  login: (type: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

**Funcionalidades**:
- Verificación de sesión al cargar la aplicación
- Almacenamiento del tipo de usuario
- Método de logout que limpia cookies y redirige

### Rutas (`App.tsx`)

```typescript
// Rutas Públicas
<Route path="/" element={<HomePage />} />
<Route path="/login" element={<Login />} />
<Route path="/registerHospital" element={<HospitalRegisterPage />} />
<Route path="/dashboard" element={<DashboardPage />} />
<Route path="/dashboardHospital" element={<DashboardHospitalPage />} />

// Rutas Protegidas
<Route path="/bloodDonors" element={<ProtectedRoute><BloodDonorsPage /></ProtectedRoute>} />
```

### Estilos

**Tailwind CSS** configurado con:
- Paleta de colores personalizada
- Tipografías: Poppins (headings), Roboto (body)
- Breakpoints responsivos: sm, md, lg, xl
- Utilidades personalizadas

---

## Configuración y Despliegue

### Backend

#### `application.properties`
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3307/railway
spring.datasource.username=root
spring.datasource.password=sasa1234
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect

# Flyway
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true

# CORS
cors.allowed-origins=http://localhost:5173

# JWT
application.security.jwt.secret-key=<secret-key>

# Server
server.port=8080
```

#### Ejecución
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend

#### `vite.config.ts`
```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

#### Ejecución
```bash
cd frontend
npm install
npm run dev
```

### Base de Datos

#### Migraciones Flyway
Ubicadas en `backend/src/main/resources/db/migration/`:

- `V1__create_bloodDonor_table.sql`
- `V2__create_hospital_table.sql`
- `V3__seed_blooddonor.sql`
- `V4__seed_hospital.sql`
- `V10__add_bloodtype_table.sql`
- `V11__seed_blood_type.sql`
- `V13__create_appointment_status_table.sql`
- `V14__seed_appointment_status.sql`
- `V16__create_appointment_table.sql`
- `V18__create_campaign_table.sql`
- `V19__create_blood_type_campaign_table.sql`
- `V20__add_hour_appointment_attribute.sql`
- `V21__seeder_appointment.sql`

Las migraciones se ejecutan automáticamente al iniciar el backend.

---

## Flujos de Usuario

### Flujo de Registro de Hospital

1. Usuario navega a `/registerHospital`
2. Completa formulario con datos obligatorios:
   - CIF (validado: 8-10 caracteres alfanuméricos, inicia con letra)
   - Nombre (min 2 caracteres, solo letras)
   - Dirección (formato validado: nombre de calle + número)
   - Email (formato válido)
   - Teléfono (9-12 dígitos)
   - Contraseña (min 8 caracteres, 1 mayúscula, 1 minúscula, 1 número)
   - **Imagen de perfil (OBLIGATORIO)**
3. Frontend valida datos en tiempo real
4. Al enviar, se crea `FormData` y se envía a `/api/auth/hospital/register`
5. Backend:
   - Valida email único
   - Hashea contraseña con BCrypt
   - Guarda imagen en disco con nombre UUID
   - Crea registro en BD
6. Respuesta exitosa: redirige a `/login`
7. Respuesta error: muestra mensaje de error

### Flujo de Login

1. Usuario ingresa en `/login`
2. Selecciona tipo de usuario (Donante/Hospital)
3. Ingresa email y contraseña
4. Frontend envía credenciales con Basic Auth a:
   - `/api/auth/bloodDonor/login` o
   - `/api/auth/hospital/login`
5. Backend:
   - Busca usuario por email
   - Verifica contraseña con BCrypt
   - Genera JWT con ID y tipo de usuario
   - Establece cookie HttpOnly con el token
6. Frontend:
   - Actualiza `AuthContext` con tipo de usuario
   - Redirige según tipo:
     - Donante → `/bloodDonors`
     - Hospital → `/dashboardHospital`

### Flujo de Dashboard Hospital

1. Hospital autenticado accede a `/dashboardHospital`
2. Componente carga:
   - Foto de perfil del hospital desde `/api/images/{imageName}`
   - Estadísticas generales desde `/api/dashboard/stats`
3. Muestra gráficos con Chart.js
4. Usuario puede:
   - Ver estadísticas
   - Hacer click en foto de perfil
   - Seleccionar "Cerrar sesión" del dropdown
5. Logout:
   - Llama a `logout()` del `AuthContext`
   - Limpia estado
   - Redirige a `/login`

### Flujo de Visualización de Citas (Implementación Futura)

1. Hospital autenticado en `/dashboardHospital`
2. Selecciona filtro de mes
3. Frontend llama a `/api/dashboard/hospital/appointments?startDate=...&endDate=...`
4. Backend:
   - Extrae `Hospital` del JWT via `@AuthenticationPrincipal`
   - Busca citas del hospital en el rango de fechas
   - Retorna lista de `Appointment`
5. Frontend renderiza gráfico de citas por día/hora
6. Usuario puede filtrar por día específico o hora

---

## Seguridad

### Autenticación y Autorización

**JWT (JSON Web Tokens)**
- Generados al login exitoso
- Contienen: `id` (usuario), `type` (bloodDonor/hospital/admin)
- Almacenados en cookies HttpOnly
- Expiración: 24 horas
- Secret key configurable en `application.properties`

**Spring Security**
- Configurado en `SecurityConfig.java`
- Endpoints públicos:
  - `/api/auth/**`
  - `/api/dashboard/**`
  - `/api/images/**`
- Endpoints protegidos requieren JWT válido
- Filtro `JwtAuthFilter` valida token en cada petición

### Validación de Contraseñas

**BCrypt** para hashing de contraseñas:
```java
passwordEncoder.encode(password) // Al registrar
passwordEncoder.matches(plainPassword, hashedPassword) // Al login
```

### CORS

Configurado para permitir peticiones desde:
- `http://localhost:5173` (desarrollo frontend)

Headers permitidos: `*`  
Métodos permitidos: `GET, POST, PUT, DELETE`  
Credentials: `true`

### Validaciones Frontend

**HospitalRegisterPage**:
- CIF: Formato alfanumérico, 8-10 caracteres, inicia con letra
- Nombre: Solo letras, min 2 caracteres
- Dirección: Debe incluir nombre de calle Y número
- Email: Formato válido, dominio válido
- Teléfono: 9-12 dígitos
- Contraseña: Min 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
- Imagen: Obligatoria, JPG/PNG, max 5MB

### Protección de Rutas Frontend

Componente `ProtectedRoute`:
```typescript
if (!isAuthenticated) {
  return <Navigate to="/login" />
}
return <>{children}</>
```

---

## Notas de Implementación

### Migrations Aplicadas

**V21 (Última migración)**:
1. Inserta 6 campañas de prueba (2025-2026)
2. Altera tabla `appointment`:
   - Añade columna `campaign_id`
   - Elimina columna `hospital_id` (migración de esquema)
   - Añade FK a `campaign`
3. Inserta ~33 citas de prueba distribuidas en 2025-2026

### Pendientes de Implementación

1. **Dashboard Hospital - Gráfico de Citas**:
   - Componente frontend para visualizar citas por mes
   - Filtros por fecha y hora
   - Integración con `/api/dashboard/hospital/appointments`

2. **Perfil de Usuario**:
   - Mostrar foto de perfil en header
   - Dropdown con opciones de perfil y logout

3. **Gestión de Campañas**:
   - CRUD completo de campañas desde frontend
   - Asignación de tipos de sangre a campañas

4. **Gestión de Citas**:
   - Creación de citas por donantes
   - Confirmación/Cancelación por hospitales
   - Notificaciones

5. **Panel de Administrador**:
   - Gestión de usuarios
   - Estadísticas avanzadas

---

## Comandos Útiles

### Backend
```bash
# Compilar
./mvnw clean install

# Ejecutar
./mvnw spring-boot:run

# Ejecutar tests
./mvnw test

# Generar JAR
./mvnw package
```

### Frontend
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

### Base de Datos
```bash
# Conectar a MySQL
mysql -u root -p -P 3307

# Usar base de datos
USE railway;

# Ver tablas
SHOW TABLES;

# Ver citas de un hospital
SELECT a.*, c.name as campaign_name 
FROM appointment a 
JOIN campaign c ON a.campaign_id = c.id 
WHERE c.hospital_id = 1;
```

---

**Última actualización**: Diciembre 2025  
**Versión del documento**: 1.0
