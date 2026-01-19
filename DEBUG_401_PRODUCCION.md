# 🔴 Debug 401 Errores Post-Despliegue

## Síntomas
Después del despliegue, siguen apareciendo errores 401 en:
- `/api/notifications/unread/count`
- `/api/notifications`
- `/api/admin/me`
- `/api/ws/info`

## 🔍 Diagnóstico Paso a Paso

### ✅ Paso 1: Verificar si el Frontend fue Rebuildeado

**CRÍTICO:** El cambio en `LdapLoginPage.tsx` requiere **rebuild del frontend**.

**¿Hiciste esto?**
```bash
cd frontend
npm run build
firebase deploy  # o tu método de despliegue
```

**Si NO lo hiciste:** El frontend sigue usando la versión antigua con `http://localhost:8080` hardcoded.

---

### ✅ Paso 2: Verificar Desde Qué Página Estás Logeándote

**Pregunta:** ¿Desde qué URL te estás logeando?

- ❌ Si usas: `https://tu-dominio.com/login` → NO usa los cambios (usa login normal, no LDAP)
- ✅ Si usas: `https://tu-dominio.com/ldaplogin` → Usa LDAP login

**El login de admin DEBE hacerse desde `/ldaplogin`**, no desde `/login`.

---

### ✅ Paso 3: Verificar Token en localStorage

**En el navegador (producción):**

1. Abre la consola del navegador (F12)
2. Ve a la pestaña **Console**
3. Ejecuta:
   ```javascript
   console.log('Token:', localStorage.getItem('token'));
   ```

**Resultados esperados:**
- ✅ **Si hay un token largo (JWT):** El login funcionó, el problema es en las peticiones siguientes
- ❌ **Si es null o undefined:** El login NO funcionó correctamente

---

### ✅ Paso 4: Verificar Request Headers en Network

**En el navegador (producción):**

1. Abre DevTools (F12)
2. Ve a la pestaña **Network**
3. Haz login como admin
4. Clickea en la petición a `/api/admin/me`
5. Ve a **Headers** → **Request Headers**
6. Busca el header **`Authorization`**

**Resultados esperados:**
- ✅ `Authorization: Bearer eyJhbGciOiJIUzI1NiIs...` → Correcto
- ❌ No hay header `Authorization` → El axiosInstance no está enviando el token

---

### ✅ Paso 5: Verificar URL de la Petición LDAP Login

**En el navegador (producción):**

1. Abre DevTools (F12) → Network
2. Haz login en `/ldaplogin`
3. Busca la petición a `ldap-login`
4. Verifica la **Request URL**

**Resultados esperados:**
- ✅ `https://blood4life-backend-production.up.railway.app/api/auth/admin/ldap-login` → Correcto (frontend rebuildeado)
- ❌ `http://localhost:8080/api/auth/admin/ldap-login` → **PROBLEMA: Frontend NO rebuildeado**

---

### ✅ Paso 6: Verificar Respuesta del LDAP Login

**En el navegador (producción):**

1. DevTools → Network → Petición a `ldap-login`
2. Ve a **Response**

**Resultados esperados:**
- ✅ Status 200 con `{"status":"OK","message":"LDAP Login successful","token":"eyJ..."}` → Login exitoso
- ❌ Status 401 → Login falló (usuario no existe en DB o LDAP no funcionó)
- ❌ Status 500 → Error en el servidor

---

### ✅ Paso 7: Verificar Logs de Railway

**Comando:**
```bash
railway logs
```

**Busca mensajes como:**
- `LDAP AUTH DEBUG: Failed for email: admin@admin.es` → LDAP falló
- `AUTH DEBUG: Admin not found in local DB for email: admin@admin.es` → **Usuario no existe en DB**
- `===== JWT WARN DEBUG =====` → Debugging del filtro JWT

---

## 🎯 Soluciones Según el Diagnóstico

### Escenario A: Frontend NO Rebuildeado
**Síntoma:** Request URL en Network muestra `localhost:8080`

**Solución:**
```bash
cd d:\Users\JuanAntonio\Desktop\blood4life\frontend
npm run build
firebase deploy
```

---

### Escenario B: Usuario admin@admin.es NO Existe en DB
**Síntoma:** Logs muestran "Admin not found in local DB"

**Solución:** Conecta a Railway MySQL y ejecuta:
```sql
INSERT INTO admin (email, password) 
VALUES ('admin@admin.es', 'admin1234')
ON DUPLICATE KEY UPDATE password = 'admin1234';
```

**Cómo conectar a Railway MySQL:**
```bash
railway variables  # Ver credenciales
railway run mysql -u <MYSQLUSER> -p<MYSQLPASSWORD> -h <MYSQLHOST> -P <MYSQLPORT> <MYSQLDATABASE>
```

---

### Escenario C: Token No Se Está Enviando
**Síntoma:** localStorage tiene token pero requests no tienen header Authorization

**Causa probable:** axiosInstance no está interceptando correctamente

**Solución temporal:** Verifica que no haya errores en la consola del navegador

---

### Escenario D: Logeándote Desde Página Incorrecta
**Síntoma:** Estás usando `/login` en vez de `/ldaplogin`

**Solución:** 
1. Ve a `https://tu-dominio.com/ldaplogin`
2. Ingresa `admin@admin.es` / `admin1234`

---

## 🚨 Acción Inmediata Recomendada

**HAZLO AHORA:**

1. **Abre la consola del navegador en producción**
2. **Ejecuta estos comandos y comparte los resultados:**

```javascript
// 1. ¿Hay token?
console.log('Token:', localStorage.getItem('token'));

// 2. ¿Qué URL está configurada?
console.log('API URL:', import.meta.env.VITE_API_URL);

// 3. ¿Desde dónde estás logeándote?
console.log('Current URL:', window.location.href);
```

3. **Ve a Network → Busca la petición a `ldap-login`**
   - Comparte la **Request URL completa**
   - Comparte el **Status Code**
   - Comparte la **Response**

---

## 📋 Checklist Rápido

- [ ] ¿Rebuildeaste el frontend después de los cambios? (`npm run build`)
- [ ] ¿Redespliegaste el frontend? (`firebase deploy`)
- [ ] ¿Estás usando `/ldaplogin` para logear?
- [ ] ¿El token aparece en localStorage?
- [ ] ¿La petición va a `blood4life-backend-production.up.railway.app`?
- [ ] ¿Verificaste que `admin@admin.es` existe en la DB de producción?

---

**Esperando tu feedback con:**
1. Resultados de los `console.log()` 
2. Request URL de la petición `ldap-login`
3. Status y response de `ldap-login`
