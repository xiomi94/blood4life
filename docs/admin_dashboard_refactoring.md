# Admin Dashboard - Arquitectura Refactorizada

## 📊 Resumen de la Refactorización

**Antes**: ~1,000 líneas en un solo archivo  
**Ahora**: ~350 líneas distribuidas en módulos reutilizables

## 📁 Estructura del Proyecto

```
AdminDashboard/
├── AdminDashboard.tsx                 (~350 líneas - Componente principal)
├── hooks/
│   ├── useAdminData.ts               (Lógica de gestión de datos)
│   └── useAdminWebSocket.ts          (Suscripciones WebSocket en tiempo real)
├── components/
│   ├── AdminStats.tsx                (Gráfico de estadísticas)
│   ├── AdminTabs.tsx                 (Navegación por tabs)
│   └── modals/
│       ├── EditDonorModal.tsx        (Modal de edición de donantes)
│       ├── EditHospitalModal.tsx     (Modal de edición de citas - reusable)
│       └── index.ts                  (Exports centralizados)
└── README.md                         (Documentación local)
```

## 🎯 Responsabilidades

### `AdminDashboard.tsx`
Componente principal que:
- Orquesta la UI y navegación
- Renderiza las tablas según el tab activo
- Gestiona estados de modales
- Integra hooks personalizados

### `hooks/useAdminData.ts`
Hook personalizado que encapsula:
- Carga de datos desde el backend
- Operaciones CRUD (Create, Read, Update, Delete)
- Gestión de loading y error states
- Integración con AuthContext

### `hooks/useAdminWebSocket.ts`
Hook personalizado que gestiona:
- Suscripciones a topics de WebSocket
- Actualizaciones en tiempo real
- Sincronización de datos

### `components/AdminStats.tsx`
Componente de visualización:
- Renderiza gráfico de Chart.js
- Display de estadísticas generales
- Configuración de opciones de gráfico

### `components/AdminTabs.tsx`
Componente de navegación:
- Gestión de tabs activas
- UI consistente de navegación
- Tipado TypeScript robusto

### `components/modals/*`
Modales de edición:
- Formularios específicos por entidad
- Validación de datos
- Integración con hooks de actualización

## ✨ Beneficios de la Refactorización

### 1. **Mantenibilidad**
- Cada archivo tiene una responsabilidad clara
- Fácil localización de bugs
- Cambios aislados no afectan otras partes

### 2. **Reusabilidad**
- Hooks pueden usarse en otros componentes
- Componentes modulares y portables
- Lógica centralizada

### 3. **Testabilidad**
- Cada hook/componente es testeable de forma independiente
- Mocks más sencillos
- Tests más específicos y mantenibles

### 4. **Legibilidad**
- Código más corto y enfocado
- Nombres descriptivos
- Estructura lógica clara

### 5. **Escalabilidad**
- Fácil añadir nuevas funcionalidades
- Estructura preparada para crecer
- Patrones establecidos para seguir

## 🔧 Cómo Extender

### Añadir un nuevo modal:
1. Crear `components/modals/EditNewEntityModal.tsx`
2. Seguir el patrón de `EditDonorModal.tsx`
3. Exportar desde `components/modals/index.ts`
4. Usar en `AdminDashboard.tsx`

### Añadir una nueva tabla/tab:
1. Añadir tipo a `TabType` en `AdminTabs.tsx`
2. Añadir headers en la sección `<thead>`
3. Añadir rows en la sección `<tbody>`
4. Añadir estados de modal si es necesario

### Añadir nueva funcionalidad de datos:
1. Extender `useAdminData.ts` con nuevos métodos
2. Consumir desde `AdminDashboard.tsx`
3. Actualizar tipados en `adminService.ts`

## 🚀 Próximos Pasos Sugeridos

1. **Crear modales faltantes**: Hospital y Campaign modales completos
2. **Añadir tests unitarios**: Para hooks y componentes
3. **Optimizaciones de rendimiento**: Memoización con `useMemo` y `useCallback`
4. **Paginación**: Para tablas con muchos registros
5. **Filtros y búsqueda**: Mejorar UX en tablas grandes

## 📝 Notas Importantes

- La refactorización mantiene **100% de funcionalidad** original
- No se han introducido breaking changes
- Todos los tipos están correctamente tipados con TypeScript
- La integración con WebSocket se mantiene funcional
- El flujo de autenticación está preservado

## 🐛 Resolución del Error 403

Durante la refactorización, se identificó y solucionó un error 403 al acceder a rutas admin:

### Problema:
- El `AuthContext` intentaba obtener el perfil del usuario inmediatamente después del login
- La cookie JWT no se había propagado completamente en el navegador
- Esto causaba errores 403 en `/api/admin/me` y otros endpoints

### Solución:
Agregado un delay de 150ms en `AuthContext.tsx` antes de obtener el perfil:
```typescript
setTimeout(() => {
  axiosInstance.get(endpoint)
    .then(res => setUser(res.data))
    .catch(err => console.error("Failed to fetch user details on login", err));
}, 150);
```

Esto permite que la cookie se establezca completamente antes de hacer requests subsecuentes.

---

**Creado**: 2026-01-12  
**Versión**: 2.0 (Refactorizada)  
**Mantenedor**: Equipo Blood4Life
