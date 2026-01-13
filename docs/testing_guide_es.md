# 🧪 Guía de Testing - Blood4Life Frontend

## 📊 Estado Actual de la Suite de Tests

### Resumen Ejecutivo
- **Total de Tests**: 50 tests pasando ✅ | 1 test skippeado ⊘
- **Archivos de Test**: 10 archivos
- **Tiempo de Ejecución**: ~4 segundos
- **Última Actualización**: 12 de Enero de 2026

### Cobertura de Código

| Métrica | Cobertura | Detalles |
|---------|-----------|----------|
| **Statements** | **54.2%** | 387/714 líneas |
| **Branches** | **31.48%** | 165/524 ramas |
| **Functions** | **46.15%** | 66/143 funciones |
| **Lines** | **57.12%** | 365/639 líneas |

---

## 📁 Estructura de Tests

### 1. Tests Unitarios (Lógica de Negocio)
Verifican funciones puras de validación de forma aislada.

#### **Validaciones** (`src/utils/__tests__/validation.test.ts`)
- ✅ `validateEmail`: Formato de email, dominios válidos
- ✅ `validateDNI`: Formato español (8 números + letra)
- ✅ `validatePassword`: Seguridad (mayúsculas, minúsculas, números)
- ✅ `validatePostalCode`: Códigos postales españoles válidos

**Cobertura**: 100% en utilidades de validación ⭐

---

### 2. Tests de Componentes (UI e Interacción)

#### **Componentes Simples**

**ThemeToggle** (`src/components/UI/ThemeToggle/ThemeToggle.test.tsx`)
- ✅ Renderizado correcto según modo actual
- ✅ Accesibilidad (aria-labels)
- ✅ Interacción con clic
- **Cobertura**: 81.81% statements

**Button** (`src/components/UI/Button/Button.test.tsx`)
- ✅ Renderizado con diferentes variantes
- ✅ Props de navegación (to, href)
- **Cobertura**: 75% statements

**FormField** (`src/components/Forms/FormField/FormField.test.tsx`)
- ✅ Renderizado de labels y placeholders
- ✅ Mensajes de error
- ✅ Estados de validación
- **Cobertura**: 100% statements ⭐

#### **Componentes de Autenticación**

**LoginForm** (`src/components/Forms/LoginForm/LoginForm.test.tsx`)
- ✅ Validación de formulario
- ✅ Llamada al servicio con credenciales
- ✅ Manejo de errores de login
- **Cobertura**: 76.31% statements

**Header** (`src/tests/Header.test.tsx`)
- ✅ Renderizado según ruta actual
- ✅ Botones de login/register en páginas públicas
- ✅ Avatar de usuario cuando está autenticado
- **Cobertura**: 44.82% statements

#### **Componentes Asíncronos**

**CampaignList** (`src/components/features/donor/CampaignList/CampaignList.test.tsx`)
- ✅ Estado de carga (loading)
- ✅ Renderizado de datos obtenidos
- ✅ Manejo de errores de red
- **Cobertura**: 100% statements ⭐

**UpcomingAppointments** (`src/components/DonorDashboard/UpcomingAppointments.test.tsx`)
- ✅ Renderizado con citas
- ✅ Estado vacío (sin citas)
- **Cobertura**: 100% statements ⭐

---

### 3. Tests de Context (Estado Global)

**AuthContext** (`src/context/AuthContext.test.tsx`)
- ✅ Inicialización sin usuario
- ✅ Carga de usuario desde localStorage
- ✅ Verificación de endpoints por userType
- ✅ Limpieza de auth con token inválido
- ✅ Error si se usa fuera del Provider
- **Tests**: 5

**ThemeContext** (`src/context/ThemeContext.test.tsx`)
- ✅ Tema claro por defecto
- ✅ Toggle entre light/dark
- ✅ Persistencia en localStorage
- ✅ Carga desde localStorage
- ✅ Error si se usa fuera del Provider
- **Tests**: 5

**Cobertura Context**: 26.04% → **Objetivo mejorado con nuevos tests** 🎯

---

### 4. Tests de Integración (Flujos Completos)

#### **Flujo de Autenticación** (`src/tests/integration/auth.flow.test.tsx`)
- ✅ Renderizado del formulario de login
- ✅ Interacción con campos del formulario
- ✅ Validación de campos requeridos
- **Propósito**: Verificar el flujo básico de login sin dependencias externas

#### **Flujo de Administración** (`src/tests/integration/campaign.flow.test.tsx`)
- ✅ Listado de donantes en Admin Dashboard
- ✅ Eliminación de donantes
- ✅ Manejo de errores de carga
- **Propósito**: Verificar gestión CRUD en panel de administración
- **Importante**: Valida uso de mocks de servicios

---

## 🎯 Áreas con Alta Cobertura (>80%)

| Componente | Cobertura | Estado |
|------------|-----------|--------|
| `src/config.ts` | 100% | ⭐ Excelente |
| `src/components/DonorDashboard` | 100% | ⭐ Excelente |
| `src/components/Forms/FormField` | 100% | ⭐ Excelente |
| `src/components/features/donor/CampaignList` | 100% | ⭐ Excelente |
| `src/hooks` | 87.5% | ✅ Muy Bueno |
| `src/utils` | 84.84% | ✅ Muy Bueno |
| `src/components/UI/ThemeToggle` | 81.81% | ✅ Bueno |

---

## ⚠️ Áreas que Requieren Mejora (<50%)

| Componente | Cobertura | Razón |
|------------|-----------|-------|
| `src/components/UI/Header` | 44.82% | Muchos casos edge sin cubrir |
| `src/context` (global) | 26.04% | Flujos complejos de autenticación |
| `src/components/Modals/EditProfileModal` | 24.59% | Componente complejo no testeado |
| `src/services` | 14.28% | APIs reales dificultan los tests |

---

## 🚀 Cómo Ejecutar los Tests

### Comandos Básicos

```bash
# Ejecutar todos los tests (modo interactivo)
npm test

# Ejecutar todos los tests una vez (CI/CD)
npm test -- --run

# Ver interfaz gráfica
npm run test:ui

# Generar reporte de cobertura
npm run coverage
```

### Ejecutar Tests Específicos

```bash
# Un archivo específico
npm test src/utils/__tests__/validation.test.ts

# Por patrón
npm test validation

# Solo tests de integración
npm test src/tests/integration
```

---

## 🔧 Configuración de Testing

### Herramientas Utilizadas

- **Framework**: Vitest 4.0.15
- **Testing Library**: @testing-library/react 16.3.0
- **Entorno**: JSDOM (simula navegador)
- **Mocks**: Centralizados en `vitest.setup.ts`

### Mocks Globales (`vitest.setup.ts`)

```typescript
// Window APIs
- window.matchMedia
- window.location (assign, replace, reload, href)

// Librerías
- react-i18next (useTranslation)
- useWebSocket (isConnected, subscribe)
```

---

## 📝 Mejores Prácticas Implementadas

### ✅ Tests Bien Estructurados
- Uso de `describe` para agrupar tests relacionados
- Nombres descriptivos que explican el comportamiento esperado
- Setup/teardown con `beforeEach` y `afterEach`

### ✅ Tests de Accesibilidad
- Búsqueda por roles (`getByRole`)
- Verificación de `aria-label` y `aria-live`
- Tests de navegación por teclado

### ✅ Mocks Efectivos
- Mocks centralizados para consistencia
- Uso de `vi.spyOn` para verificar llamadas
- Importación de mocks de servicios cuando es necesario

### ✅ Cobertura Incremental
- Prioridad en componentes críticos
- Tests de regresión para bugs arreglados
- Documentación de casos edge conocidos

---

## 🎯 Próximos Pasos Recomendados

### Prioridad Alta
1. **EditProfileModal**: Componente crítico sin tests (24.59%)
2. **Services**: Crear mocks consistentes para APIs
3. **Header**: Cubrir casos edge de navegación

### Prioridad Media
4. **Context**: Mejorar cobertura de flujos complejos
5. **Integration Tests**: Agregar más flujos E2E
6. **Error Boundaries**: Tests de manejo de errores

### Prioridad Baja
7. **Snapshot Tests**: Para componentes estables
8. **Performance Tests**: Renderizado de listas largas
9. **A11y Tests**: Auditoría completa de accesibilidad

---

## 📚 Referencias y Recursos

- [Vitest Docs](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/react)
- [Kent C. Dodds - Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Última Actualización**: 12 de Enero de 2026  
**Mantenedor**: Equipo de Desarrollo Blood4Life
