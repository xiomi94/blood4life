# Resolución de Errores 401 en Producción - Admin Login

## 🔴 Problema Identificado

Al intentar iniciar sesión como admin en producción, se obtienen errores 401 en múltiples endpoints:
- `/api/notifications/unread/count` → 401
- `/api/notifications` → 401
- `/api/admin/me` → 401
- `/api/ws/info` → 401

## 🔍 Análisis de Causa Raíz

Se identificaron **3 problemas críticos**:

### 1. ❌ URL Hardcoded en Frontend (RESUELTO ✅)
**Archivo:** `frontend/src/pages/LdapLoginPage/LdapLoginPage.tsx`

**Problema:** La página de login LDAP tenía hardcoded `http://localhost:8080` en lugar de usar la configuración dinámica de la API.

```typescript
// ❌ ANTES (línea 26)
const response = await fetch('http://localhost:8080/api/auth/admin/ldap-login', {
    method: 'POST',
    headers: { 'Authorization': authHeader }
});
```

**Solución:** Cambiar a usar `axiosInstance` que automáticamente usa la variable de entorno `VITE_API_URL`:

```typescript
// ✅ DESPUÉS
const response = await axiosInstance.post('/auth/admin/ldap-login', {}, {
    headers: { 'Authorization': authHeader }
});
```

### 2. ❌ Configuración LDAP Faltante en Producción (RESUELTO ✅)
**Archivo:** `backend/src/main/resources/application-prod.properties`

**Problema:** El archivo de configuración de producción no tenía la configuración del servidor LDAP embebido, necesario para autenticación de admins.

**Solución:** Se añadió la siguiente configuración:

```properties
# LDAP Configuration (Embedded LDAP Server for Admin Authentication)
spring.ldap.embedded.ldif=classpath:test-server.ldif
spring.ldap.embedded.base-dn=dc=blood4life,dc=com
spring.ldap.embedded.port=8389
spring.ldap.embedded.validation.enabled=false

# LDAP Connection
spring.ldap.urls=ldap://localhost:8389
spring.ldap.base=dc=blood4life,dc=com
```

### 3. ⚠️ Usuario Admin No Existe en Base de Datos de Producción (VERIFICAR)
**Problema:** El flujo de autenticación LDAP tiene 2 pasos:
1. ✅ Autenticar contra LDAP (embebido)
2. ❌ Buscar el admin en la base de datos MySQL para obtener el ID

**Código relevante** (`AuthController.java` líneas 329-333):
```java
// 2. Find admin in local DB to get ID/Role
Optional<Admin> adminOpt = adminService.findByEmail(email);
if (adminOpt.isEmpty()) {
    System.out.println("AUTH DEBUG: Admin not found in local DB for email: " + email);
    return errorResponse("User not found locally", HttpStatus.UNAUTHORIZED);
}
```

**Solución:** Verificar que existe el usuario `admin@admin.es` en la base de datos MySQL de producción.

## ✅ Cambios Realizados

### Frontend
1. ✅ Modificado `LdapLoginPage.tsx` para usar `axiosInstance` en lugar de `fetch` con URL hardcoded
2. ✅ Configuración `.env.production` ya estaba correcta:
   ```
   VITE_API_URL=https://blood4life-backend-production.up.railway.app/api
   ```

### Backend
1. ✅ Añadida configuración LDAP a `application-prod.properties`

## 📋 Pasos para Desplegar

### Paso 1: Commit y Push de Cambios
```bash
cd d:\Users\JuanAntonio\Desktop\blood4life

# Añadir cambios
git add frontend/src/pages/LdapLoginPage/LdapLoginPage.tsx
git add backend/src/main/resources/application-prod.properties

# Commit
git commit -m "fix: resolver errores 401 en login admin producción

- Usar axiosInstance en LdapLoginPage para URL dinámica
- Añadir configuración LDAP a application-prod.properties"

# Push
git push origin main
```

### Paso 2: Verificar Despliegue en Railway
1. Ve a Railway Dashboard
2. Verifica que el backend se redespliega automáticamente
3. Espera a que termine el despliegue

### Paso 3: Verificar Usuario Admin en Base de Datos
**IMPORTANTE:** Necesitas verificar que el usuario `admin@admin.es` existe en la base de datos de producción.

**Opción A - Usando Railway CLI:**
```bash
railway run mysql -u $MYSQLUSER -p$MYSQLPASSWORD -h $MYSQLHOST -P $MYSQLPORT $MYSQLDATABASE
```

**Opción B - Usando MySQL Workbench o Similar:**
Conecta a la base de datos de Railway y ejecuta:
```sql
SELECT * FROM admin WHERE email = 'admin@admin.es';
```

**Opción C - Si el usuario no existe, créalo:**
```sql
-- En producción, insertar el admin si no existe
INSERT INTO admin (email, password) 
VALUES ('admin@admin.es', 'admin1234')
ON DUPLICATE KEY UPDATE password = 'admin1234';
```

### Paso 4: Build y Deploy Frontend
```bash
cd frontend

# Build con variables de producción
npm run build

# Desplegar a Firebase (o tu servicio de hosting)
firebase deploy
```

### Paso 5: Probar el Login
1. Ve a tu aplicación en producción
2. Navega a `/ldaplogin`
3. Ingresa credenciales:
   - **Email:** `admin@admin.es`
   - **Password:** `admin1234`
4. Verifica que:
   - ✅ No hay errores 401
   - ✅ El login es exitoso
   - ✅ Redirecciona a `/dashboard`
   - ✅ Se cargan las notificaciones
   - ✅ Se carga `/api/admin/me`

## 🔍 Debugging Adicional

Si aún hay errores 401 después del despliegue:

### 1. Verificar Logs del Backend en Railway
```bash
railway logs
```

Buscar mensajes como:
- `LDAP AUTH DEBUG: Failed for email: admin@admin.es`
- `AUTH DEBUG: Admin not found in local DB for email: admin@admin.es`

### 2. Verificar Token en Frontend
Abre la consola del navegador y ejecuta:
```javascript
console.log('Token:', localStorage.getItem('token'));
```

### 3. Verificar Request Headers
En DevTools → Network → Selecciona cualquier request a `/api/admin/*`:
- Verifica que el header `Authorization: Bearer <token>` esté presente
- Copia el token y decodifícalo en https://jwt.io

## 📝 Notas Importantes

1. **LDAP Embebido:** Estamos usando un servidor LDAP embebido que se inicia con la aplicación Spring Boot. Esto funciona bien para desarrollo y pruebas, pero en un entorno de producción real, deberías considerar usar un servidor LDAP externo dedicado.

2. **Contraseñas en Texto Plano:** El admin en la base de datos tiene la contraseña en texto plano. El código en `AuthController.java` (líneas 275-284) soporta tanto contraseñas hasheadas con BCrypt como contraseñas en texto plano para retrocompatibilidad.

3. **Configuración CORS:** Verifica que `CORS_ALLOWED_ORIGINS` en Railway incluya tu dominio de producción del frontend.

## 🎯 Checklist Final

- [ ] Cambios commiteados y pusheados a Git
- [ ] Backend redespliegado en Railway
- [ ] Verificado que usuario `admin@admin.es` existe en DB de producción
- [ ] Frontend rebuildeado con variables de producción
- [ ] Frontend redespliegado
- [ ] Login admin funciona sin errores 401
- [ ] Dashboard carga correctamente
- [ ] Notificaciones funcionan
- [ ] WebSocket conecta correctamente

## 🆘 Si Nada Funciona

Si después de todos estos pasos aún hay problemas:

1. **Habilita debug logs en JwtAuthFilter** (ya están configurados con `logger.warn`)
2. **Verifica que el archivo `test-server.ldif` esté incluido en el JAR de producción**
3. **Considera una migración temporal** a autenticación admin directa (sin LDAP) en producción
