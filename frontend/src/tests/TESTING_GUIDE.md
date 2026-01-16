# 📚 Guía de Tests - Blood4Life Frontend

## 📖 Resumen Ejecutivo

Este documento describe los diferentes tipos de tests implementados en el proyecto Blood4Life, explicando qué prueba cada uno y cuándo usar cada tipo.

---

## 🎯 Tipos de Tests en el Proyecto

### 1. **Tests Unitarios Puros** 
*Testing de funciones puras sin dependencias*

**Ubicación**: `src/tests/utils/`

**Ejemplo**: `validation.test.ts`

**Características**:
- Prueban funciones puras (sin efectos secundarios)
- No requieren React, DOM, ni APIs
- Entrada → Salida predecible
- No necesitan mocks
- Los más simples y rápidos de ejecutar

**Qué se prueba**:
- Funciones de validación (email, DNI, password, código postal)
- Lógica de negocio pura
- Transformaciones de datos
- Cálculos y algoritmos

**Cuándo usar**:
- Para probar utilidades y helpers
- Para lógica de negocio sin dependencias
- Cuando la función no tiene efectos secundarios

---

### 2. **Tests Unitarios de Componentes de Presentación**
*Testing de componentes "tontos" que solo renderizan props*

**Ubicación**: `src/tests/components/`

**Ejemplo**: `UpcomingAppointments.test.tsx`

**Características**:
- Prueban componentes que solo renderizan datos
- No hay fetching de datos
- No hay estado complejo
- Reciben todo por props

**Qué se prueba**:
- Renderizado correcto de datos
- Estados vacíos (sin datos)
- Formateo de información
- Presentación visual

**Cuándo usar**:
- Para componentes de presentación pura
- Cuando el componente no tiene lógica compleja
- Para verificar formateo y visualización

---

### 3. **Tests Unitarios de Componentes Asíncronos**
*Testing de componentes que hacen fetching de datos*

**Ubicación**: `src/tests/components/`

**Ejemplo**: `CampaignList.test.tsx`

**Características**:
- Prueban componentes con operaciones asíncronas
- Mockean servicios/APIs
- Verifican múltiples estados (loading, success, error)

**Qué se prueba**:
- Estado de carga (loading)
- Renderizado con datos exitosos
- Manejo de errores en fetch
- Transiciones entre estados

**Cuándo usar**:
- Para componentes que hacen fetch de datos
- Cuando hay estados asíncronos
- Para verificar manejo de loading/error

---

### 4. **Tests Unitarios de Componentes Interactivos**
*Testing de componentes con interacción del usuario*

**Ubicación**: `src/tests/components/`

**Ejemplos**: 
- `LoginForm.test.tsx` - Formulario con validación y submit
- `ThemeToggle.test.tsx` - Toggle simple con callback

**Características**:
- Prueban interacciones del usuario (clicks, inputs)
- Mockean dependencias externas (servicios, contextos)
- Verifican callbacks y llamadas a funciones

**Qué se prueba**:
- Renderizado de elementos UI
- Cambios en inputs
- Validación de formularios
- Llamadas a servicios con datos correctos
- Manejo de errores de usuario

**Cuándo usar**:
- Para formularios
- Para componentes con clicks/interacciones
- Cuando hay validación de entrada

---

### 5. **Tests Unitarios de Componentes de Layout**
*Testing de componentes que cambian según contexto/ruta*

**Ubicación**: `src/tests/components/`

**Ejemplo**: `Header.test.tsx`

**Características**:
- Prueban renderizado condicional
- Usan MemoryRouter para simular rutas
- Integran múltiples contextos
- Verifican estados de autenticación

**Qué se prueba**:
- Renderizado diferente según ruta
- Elementos mostrados/ocultos según auth
- Integración con contextos múltiples
- Navegación condicional

**Cuándo usar**:
- Para headers, footers, sidebars
- Cuando el componente cambia según la ruta
- Para componentes con lógica condicional compleja

---

### 6. **Tests Unitarios de React Context**
*Testing de lógica de estado global*

**Ubicación**: `src/tests/context/`

**Ejemplos**:
- `AuthContext.test.tsx` - Autenticación y sesión
- `ThemeContext.test.tsx` - Tema claro/oscuro

**Características**:
- Prueban Providers y hooks personalizados
- Verifican estado global y persistencia
- Mockean APIs externas
- Verifican efectos secundarios (DOM, localStorage)

**Qué se prueba**:
- Estado inicial del contexto
- Cambios de estado
- Persistencia en localStorage
- Llamadas a APIs
- Limpieza de estado
- Protección contra uso incorrecto (fuera del Provider)

**Cuándo usar**:
- Para Contexts de React
- Cuando hay estado global
- Para lógica de persistencia

---

### 7. **Tests de Integración**
*Testing de flujos completos con múltiples componentes*

**Ubicación**: `src/tests/integration/`

**Ejemplos**:
- `campaign.flow.test.tsx` - Dashboard completo con CRUD
- `auth.flow.test.tsx` - Flujo de login

**Características**:
- Prueban flujos end-to-end
- Múltiples componentes trabajando juntos
- Mockean solo servicios externos (APIs)
- No mockean componentes internos
- Simulan interacciones reales del usuario

**Qué se prueba**:
- Flujos completos de usuario
- Integración entre componentes
- Manejo resiliente de errores (algunas partes fallan pero la app sigue)
- Interacciones complejas (modales, confirmaciones, CRUD)

**Cuándo usar**:
- Para verificar flujos completos
- Cuando múltiples componentes interactúan
- Para probar resiliencia del sistema
- Para escenarios end-to-end

---

## 📊 Comparación: Unitarios vs Integración

| Aspecto | Unitarios | Integración |
|---------|-----------|-------------|
| **Alcance** | Componente/función aislada | Múltiples componentes juntos |
| **Mocks** | Todas las dependencias | Solo APIs externas |
| **Velocidad** | Muy rápidos | Más lentos |
| **Complejidad** | Simple | Compleja |
| **Mantenimiento** | Fácil | Más difícil |
| **Confianza** | Limitada (aislado) | Alta (flujo real) |
| **Cuándo fallan** | Cambio en la unidad | Cambio en el flujo |

---

## 🎓 Pirámide de Testing

```
        /\
       /  \      E2E Tests (pocos)
      /____\     
     /      \    Tests de Integración (moderados)
    /________\   
   /          \  Tests Unitarios (muchos)
  /____________\ 
```

**Distribución recomendada**:
- 70% Tests Unitarios
- 20% Tests de Integración  
- 10% Tests E2E (no implementados aún)

---

## 🛠️ Técnicas Usadas en el Proyecto

### 1. **Mocking**
- `vi.mock()` para mockear módulos enteros
- `vi.fn()` para mockear funciones
- `vi.spyOn()` para espiar métodos

### 2. **Rendering**
- `render()` - Renderiza componentes
- `screen` - Queries del DOM
- `fireEvent` - Simula interacciones
- `waitFor` - Espera cambios asíncronos

### 3. **Assertions**
- `expect().toBe()` - Igualdad estricta
- `expect().toBeInTheDocument()` - Elemento presente
- `expect().toHaveBeenCalled()` - Función fue llamada
- `expect().toHaveTextContent()` - Contenido de texto

### 4. **Test Parametrizados**
- `it.each([...])` - Ejecuta el mismo test con diferentes inputs

### 5. **Proveedores de Test**
- Helper functions (`renderWithProviders`) para evitar código repetitivo

---

## 📝 Convenciones del Proyecto

### Nomenclatura de Archivos
- `*.test.tsx` - Tests de componentes React
- `*.test.ts` - Tests de funciones TypeScript

### Estructura de Tests
```typescript
describe('NombreDelComponente/Función', () => {
    beforeEach(() => {
        // Setup antes de cada test
    });

    it('debe hacer X cuando Y', () => {
        // Arrange - Setup
        // Act - Acción
        // Assert - Verificación
    });
});
```

### Mensajes de Tests
- Usar "debe" al inicio
- Describir comportamiento esperado
- Incluir condición si aplica

**Ejemplos**:
- ✅ `debe mostrar un mensaje cuando no hay citas`
- ✅ `debe validar campos requeridos`
- ❌ `test de login`
- ❌ `funciona correctamente`

---

## 🚀 Comandos de Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar un archivo específico
npm test -- validation.test.ts

# Ver cobertura
npm test -- --coverage

# Ejecutar solo tests de integración
npm test -- integration/
```

---

## 🎯 Resumen por Tipo

| Tipo | Archivos | Propósito Principal |
|------|----------|---------------------|
| **Unitario Puro** | `validation.test.ts` | Funciones puras sin dependencias |
| **Componente Presentacional** | `UpcomingAppointments.test.tsx` | Visualización de datos |
| **Componente Asíncrono** | `CampaignList.test.tsx` | Fetching de datos |
| **Componente Interactivo** | `LoginForm.test.tsx`, `ThemeToggle.test.tsx` | Interacción del usuario |
| **Componente de Layout** | `Header.test.tsx` | Renderizado condicional |
| **React Context** | `AuthContext.test.tsx`, `ThemeContext.test.tsx` | Estado global |
| **Integración** | `campaign.flow.test.tsx`, `auth.flow.test.tsx` | Flujos completos |

---

## 📌 Buenas Prácticas

1. **Aislamiento**: Cada test debe ser independiente
2. **Claridad**: Nombres descriptivos y comportamiento claro
3. **Cobertura**: Probar casos exitosos, errores y edge cases
4. **Mantenibilidad**: DRY (Don't Repeat Yourself) con helpers
5. **Velocidad**: Tests rápidos = feedback rápido
6. **Realismo**: Tests de integración simulan uso real

---

## 🔍 FAQ

**P: ¿Cuándo escribo un test unitario vs uno de integración?**
R: Unitario para lógica aislada. Integración para flujos completos de usuario.

**P: ¿Debo mockear todo en tests unitarios?**
R: Sí, mockea dependencias externas (APIs, servicios) pero no lógica interna.

**P: ¿Por qué algunos tests tienen console.error spy?**
R: Para suprimir errores esperados (como probar validación de errores) en el output.

**P: ¿Qué significa "resiliente" en tests de integración?**
R: Que el sistema sigue funcionando aunque algunas partes fallen (ej: stats fallan pero el dashboard se muestra).

---

*Última actualización: 2026-01-13*
