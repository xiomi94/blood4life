# Documentación de WebSockets para BloodDonor

## 📋 Índice

1. [Introducción](#introducción)
2. [¿Qué son los WebSockets?](#qué-son-los-websockets)
3. [¿Para qué se implementaron?](#para-qué-se-implementaron)
4. [Arquitectura de la implementación](#arquitectura-de-la-implementación)
5. [Componentes del Backend](#componentes-del-backend)
6. [Componentes del Frontend](#componentes-del-frontend)
7. [Flujo de comunicación](#flujo-de-comunicación)
8. [Casos de uso](#casos-de-uso)
9. [Configuración y dependencias](#configuración-y-dependencias)
10. [Debugging y logs](#debugging-y-logs)

---

## 🎯 Introducción

Este documento describe la implementación de **WebSockets** en el sistema **Blood4Life** para la gestión en tiempo real del contador de donantes de sangre. La implementación utiliza **STOMP** (Simple Text Oriented Messaging Protocol) sobre **SockJS** para garantizar compatibilidad con navegadores que no soportan WebSockets nativamente.

---

## 🔌 ¿Qué son los WebSockets?

Los **WebSockets** son un protocolo de comunicación bidireccional en tiempo real entre un cliente (navegador) y un servidor. A diferencia de HTTP tradicional (request-response), los WebSockets permiten:

- **Comunicación bidireccional**: El servidor puede enviar datos al cliente sin que este lo solicite
- **Comunicación en tiempo real**: Las actualizaciones se reciben instantáneamente
- **Conexión persistente**: Se mantiene una única conexión abierta en lugar de múltiples peticiones HTTP
- **Menor latencia**: Ideal para aplicaciones que requieren actualizaciones instantáneas

---

## 💡 ¿Para qué se implementaron?

Los WebSockets se implementaron en **Blood4Life** para:

### Caso de uso principal: **Contador de donantes en tiempo real**

1. **Sincronización automática**: Cuando un nuevo donante se registra o se elimina del sistema, el contador total de donantes se actualiza automáticamente en **todos** los dashboards abiertos sin necesidad de recargar la página.

2. **Experiencia de usuario mejorada**: Los administradores y usuarios pueden ver el total de donantes actualizado en tiempo real, proporcionando una experiencia más dinámica e interactiva.

3. **Reducción de carga del servidor**: En lugar de que cada cliente haga peticiones HTTP periódicas al servidor (polling), el servidor notifica a los clientes solo cuando hay cambios.

### Casos de uso futuros:

- Notificaciones en tiempo real de campañas nuevas
- Actualizaciones de estado de citas médicas
- Alertas de urgencia para donaciones críticas
- Chat en tiempo real entre donantes y hospitales

---

## 🏗️ Arquitectura de la implementación

La arquitectura sigue el patrón **Publish-Subscribe (Pub-Sub)**:

```
┌─────────────────────────────────────────────────────────────────┐
│                        ARQUITECTURA WEBSOCKET                    │
└─────────────────────────────────────────────────────────────────┘

                    BACKEND (Spring Boot)
    ┌───────────────────────────────────────────────────┐
    │                                                   │
    │  ┌─────────────────────────────────────────┐     │
    │  │    BloodDonorServiceImpl.java           │     │
    │  │  - createNew() → sentTotalBloodDonors() │     │
    │  │  - delete() → sentTotalBloodDonors()    │     │
    │  └──────────────────┬──────────────────────┘     │
    │                     │                             │
    │                     ▼                             │
    │  ┌─────────────────────────────────────────┐     │
    │  │  BloodDonorWebSocketController.java     │     │
    │  │  @MessageMapping("/getTotalDonors")     │     │
    │  │  @SendTo("/topic/total-bloodDonors")    │     │
    │  └──────────────────┬──────────────────────┘     │
    │                     │                             │
    │                     ▼                             │
    │  ┌─────────────────────────────────────────┐     │
    │  │        WebSocketConfig.java             │     │
    │  │  - Endpoint: /ws                        │     │
    │  │  - Broker: /topic                       │     │
    │  │  - App prefix: /app                     │     │
    │  └─────────────────────────────────────────┘     │
    │                                                   │
    └─────────────────────────┬─────────────────────────┘
                              │
                              │ WebSocket Connection
                              │ ws://localhost:8080/ws
                              │
                              ▼
                    FRONTEND (React + TypeScript)
    ┌───────────────────────────────────────────────────┐
    │                                                   │
    │  ┌─────────────────────────────────────────┐     │
    │  │     websocketService.ts                 │     │
    │  │  - connect()                            │     │
    │  │  - subscribe()                          │     │
    │  │  - disconnect()                         │     │
    │  └──────────────────┬──────────────────────┘     │
    │                     │                             │
    │                     ▼                             │
    │  ┌─────────────────────────────────────────┐     │
    │  │     useWebSocket.ts (Hook)              │     │
    │  │  - Gestiona conexión                    │     │
    │  │  - Provee subscribe()                   │     │
    │  └──────────────────┬──────────────────────┘     │
    │                     │                             │
    │                     ▼                             │
    │  ┌─────────────────────────────────────────┐     │
    │  │  DashboardBloodDonorPage.tsx            │     │
    │  │  - useEffect: subscribe()               │     │
    │  │  - setTotalDonors(message.body)         │     │
    │  └─────────────────────────────────────────┘     │
    │                                                   │
    └───────────────────────────────────────────────────┘
```

---

## 🔧 Componentes del Backend

### 1. **WebSocketConfig.java**

**Ubicación**: `backend/src/main/java/com/xiojuandawt/blood4life/config/WebSocketConfig.java`

**Propósito**: Configuración global de WebSocket para Spring Boot.

**Configuración clave**:

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Broker simple en memoria para enviar mensajes a clientes
        config.enableSimpleBroker("/topic");
        
        // Prefijo para mensajes desde clientes
        config.setApplicationDestinationPrefixes("/app");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint principal para conexiones WebSocket
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")  // Permite todos los orígenes
                .withSockJS();  // Fallback para navegadores sin WebSocket
    }
}
```

**¿Qué hace?**

- **`/ws`**: Endpoint donde los clientes se conectan al WebSocket
- **`/topic`**: Prefijo para canales de publicación (broadcasting)
- **`/app`**: Prefijo para mensajes que los clientes envían al servidor
- **`withSockJS()`**: Proporciona soporte de fallback si el navegador no soporta WebSocket nativo

---

### 2. **BloodDonorWebSocketController.java**

**Ubicación**: `backend/src/main/java/com/xiojuandawt/blood4life/controllers/BloodDonorWebSocketController.java`

**Propósito**: Controlador que maneja las peticiones WebSocket relacionadas con donantes.

```java
@Controller
public class BloodDonorWebSocketController {
    
    @Autowired
    private BloodDonorRepository bloodDonorRepository;
    
    @MessageMapping("/getTotalDonors")
    @SendTo("/topic/total-bloodDonors")
    public long getTotalDonors() {
        long totalDonors = bloodDonorRepository.count();
        log.info("Solicitud WebSocket de total de donantes. Devolviendo: {}", totalDonors);
        return totalDonors;
    }
}
```

**¿Qué hace?**

- **`@MessageMapping("/getTotalDonors")`**: Escucha mensajes enviados a `/app/getTotalDonors`
- **`@SendTo("/topic/total-bloodDonors")`**: Envía la respuesta a todos los clientes suscritos a este topic
- Consulta el repositorio para obtener el total de donantes
- Retorna el valor que se broadcast a todos los suscriptores

---

### 3. **BloodDonorServiceImpl.java** (Integración)

**Ubicación**: `backend/src/main/java/com/xiojuandawt/blood4life/services/BloodDonorServiceImpl.java`

**Propósito**: Servicio que dispara eventos WebSocket cuando cambia el total de donantes.

**Métodos que notifican cambios**:

```java
@Override
public BloodDonorDTO createNew(BloodDonor bloodDonor) {
    BloodDonor newBloodDonor = this.bloodDonorRepository.save(bloodDonor);
    
    // Broadcast nuevo total por WebSocket
    long totalBloodDonors = bloodDonorRepository.count();
    bloodDonorWebSocketService.sentTotalBloodDonors(totalBloodDonors);
    
    return parseEntityToDto(newBloodDonor);
}

@Override
public void delete(int id) {
    this.bloodDonorRepository.deleteById(id);
    
    // Broadcast nuevo total por WebSocket
    long totalBloodDonors = bloodDonorRepository.count();
    bloodDonorWebSocketService.sentTotalBloodDonors(totalBloodDonors);
}
```

**¿Qué hace?**

- Cuando se **crea** un nuevo donante → envía notificación WebSocket
- Cuando se **elimina** un donante → envía notificación WebSocket
- Esto asegura que todos los clientes conectados reciban la actualización en tiempo real

---

## 🎨 Componentes del Frontend

### 1. **websocketService.ts**

**Ubicación**: `frontend/src/services/websocketService.ts`

**Propósito**: Servicio singleton que gestiona la conexión WebSocket con el backend.

**Métodos principales**:

```typescript
class WebSocketService {
    private client: Client | null = null;
    private connected: boolean = false;
    
    // Conecta al servidor WebSocket
    connect(url: string): Promise<void>
    
    // Suscribe a un topic específico
    subscribe(destination: string, callback: (message: any) => void): () => void
    
    // Desconecta del servidor
    disconnect(): void
    
    // Verifica si está conectado
    isConnected(): boolean
}
```

**Características**:

- Utiliza **SockJS** para la conexión
- Utiliza **STOMP** como protocolo de mensajería
- Reconexión automática con delay de 5 segundos
- Heartbeat cada 4 segundos para mantener la conexión viva
- Manejo de errores y logs descriptivos

---

### 2. **useWebSocket.ts** (Hook personalizado)

**Ubicación**: `frontend/src/hooks/useWebSocket.ts`

**Propósito**: Hook de React que facilita el uso de WebSockets en componentes.

```typescript
export const useWebSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    
    useEffect(() => {
        // Se conecta automáticamente al montar
        const connectWebSocket = async () => {
            await websocketService.connect(WEBSOCKET_URL);
            setIsConnected(true);
        };
        
        connectWebSocket();
        
        // Se desconecta al desmontar
        return () => {
            websocketService.disconnect();
            setIsConnected(false);
        };
    }, []);
    
    const subscribe = (destination: string, callback: (message: any) => void) => {
        return websocketService.subscribe(destination, callback);
    };
    
    return { isConnected, subscribe };
};
```

**¿Qué hace?**

- Gestiona el ciclo de vida de la conexión WebSocket
- Se conecta al montar el componente
- Se desconecta al desmontar el componente
- Proporciona método `subscribe()` para suscribirse a topics

---

### 3. **DashboardBloodDonorPage.tsx** (Uso del WebSocket)

**Ubicación**: `frontend/src/pages/DashboardBloodDonorPage/DashboardBloodDonorPage.tsx`

**Propósito**: Dashboard del donante que muestra el contador en tiempo real.

**Implementación del contador de donantes**:

```typescript
const DashboardBloodDonorPage = () => {
    const [totalDonors, setTotalDonors] = useState(0);
    
    // WebSocket connection para total donors counter
    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('✅ WebSocket conectado al servidor');
                
                // Suscribirse al topic de actualizaciones
                client.subscribe('/topic/total-bloodDonors', (message) => {
                    console.log('📊 Total de donantes recibido:', message.body);
                    setTotalDonors(Number(message.body));
                });
                
                // Solicitar el total actual al servidor
                client.publish({
                    destination: '/app/getTotalDonors',
                    body: '',
                });
            },
            onStompError: (frame) => {
                console.error('❌ Error en WebSocket:', frame);
            },
            onWebSocketClose: () => {
                console.log('🔌 WebSocket desconectado');
            },
        });
        
        client.activate();
        
        return () => {
            console.log('🔌 Cerrando conexión WebSocket...');
            client.deactivate();
        };
    }, []);
    
    return (
        <div>
            <h2>Total de Donantes: {totalDonors}</h2>
            {/* ... resto del dashboard ... */}
        </div>
    );
};
```

**¿Qué hace?**

1. **Al montar el componente**:
   - Crea una conexión WebSocket con el servidor
   - Se suscribe al topic `/topic/total-bloodDonors`
   - Solicita el total actual de donantes enviando un mensaje a `/app/getTotalDonors`

2. **Al recibir actualizaciones**:
   - Actualiza el estado `totalDonors` con el nuevo valor
   - React re-renderiza automáticamente el componente con el nuevo contador

3. **Al desmontar el componente**:
   - Cierra la conexión WebSocket para liberar recursos

---

## 🔄 Flujo de comunicación

### Escenario 1: **Carga inicial del dashboard**

```
1. Usuario abre el Dashboard
   ↓
2. DashboardBloodDonorPage se monta
   ↓
3. useEffect() se ejecuta
   ↓
4. Cliente se conecta a ws://localhost:8080/ws
   ↓
5. Cliente se suscribe a /topic/total-bloodDonors
   ↓
6. Cliente envía mensaje a /app/getTotalDonors
   ↓
7. Servidor recibe en @MessageMapping("/getTotalDonors")
   ↓
8. Servidor consulta BloodDonorRepository.count()
   ↓
9. Servidor envía respuesta a /topic/total-bloodDonors
   ↓
10. Todos los clientes suscritos reciben el total
   ↓
11. Cliente actualiza estado setTotalDonors(value)
   ↓
12. React re-renderiza con el nuevo total
```

### Escenario 2: **Nuevo donante se registra**

```
1. Usuario se registra como donante (BloodDonorRegisterForm)
   ↓
2. Frontend envía POST /auth/register/donor
   ↓
3. Backend: AuthController recibe la petición
   ↓
4. Backend: BloodDonorServiceImpl.createNew() se ejecuta
   ↓
5. Backend: Se guarda el nuevo donante en la BD
   ↓
6. Backend: bloodDonorRepository.count() obtiene nuevo total
   ↓
7. Backend: bloodDonorWebSocketService.sentTotalBloodDonors(total)
   ↓
8. Backend: Envía mensaje a /topic/total-bloodDonors
   ↓
9. TODOS los dashboards abiertos reciben la actualización
   ↓
10. Cada cliente ejecuta setTotalDonors(newTotal)
   ↓
11. Los contadores se actualizan automáticamente en TODOS los navegadores
```

### Escenario 3: **Donante es eliminado**

```
1. Admin elimina un donante
   ↓
2. Frontend envía DELETE /admin/donor/{id}
   ↓
3. Backend: BloodDonorServiceImpl.delete(id) se ejecuta
   ↓
4. Backend: Se elimina el donante de la BD
   ↓
5. Backend: bloodDonorRepository.count() obtiene nuevo total
   ↓
6. Backend: bloodDonorWebSocketService.sentTotalBloodDonors(total)
   ↓
7. Backend: Envía mensaje a /topic/total-bloodDonors
   ↓
8. TODOS los dashboards reciben la actualización
   ↓
9. Contadores se actualizan automáticamente
```

---

## 📱 Casos de uso

### Caso de uso 1: **Dashboard en tiempo real**

**Usuario**: Administrador del sistema  
**Objetivo**: Ver el total de donantes actualizado en tiempo real

**Flujo**:
1. El administrador abre el dashboard
2. Ve el contador actual de donantes
3. Otro usuario se registra como donante desde otro dispositivo
4. **Sin recargar la página**, el contador se actualiza automáticamente
5. El administrador ve el nuevo total instantáneamente

**Beneficio**: No necesita actualizar manualmente la página para ver cambios

---

### Caso de uso 2: **Múltiples usuarios simultáneos**

**Escenario**: 5 administradores tienen abierto el dashboard simultáneamente

**Flujo**:
1. Los 5 dashboards muestran "Total de Donantes: 100"
2. Un nuevo donante se registra
3. **Todos los 5 dashboards** se actualizan automáticamente a "101"
4. No hay necesidad de polling ni recargar páginas

**Beneficio**: Sincronización perfecta entre todos los clientes conectados

---

### Caso de uso 3: **Notificación de campañas (futuro)**

**Objetivo**: Notificar a todos los usuarios cuando se crea una nueva campaña

**Implementación futura**:
```typescript
// Frontend
client.subscribe('/topic/campaigns', (message) => {
    if (message.type === 'CAMPAIGN_CREATED') {
        showNotification('¡Nueva campaña disponible!');
        refreshCampaigns();
    }
});
```

---

## ⚙️ Configuración y dependencias

### Backend (Spring Boot)

**Dependencias en `pom.xml`**:

```xml
<!-- WebSocket support -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

**Configuración en `application.properties`**:

Por defecto, Spring Boot configura WebSocket en el puerto de la aplicación (8080).

---

### Frontend (React + TypeScript)

**Dependencias en `package.json`**:

```json
{
  "dependencies": {
    "sockjs-client": "^1.6.1",
    "@stomp/stompjs": "^7.0.0"
  }
}
```

**Instalación**:

```bash
npm install sockjs-client @stomp/stompjs
```

**Variables de entorno** (`.env`):

```env
VITE_API_URL=http://localhost:8080
```

La URL del WebSocket se construye automáticamente en `useWebSocket.ts`:

```typescript
const getWebSocketURL = () => {
    if (window.location.hostname === 'localhost') {
        return `${window.location.protocol}//${window.location.host}/ws`;
    }
    if (import.meta.env.VITE_API_URL) {
        return `${import.meta.env.VITE_API_URL}/ws`;
    }
    return `${window.location.protocol}//${window.location.host}/ws`;
};
```

---

## 🐛 Debugging y logs

### Logs del Backend

**Nivel INFO**: Operaciones normales

```
INFO - Solicitud WebSocket de total de donantes. Devolviendo: 42
INFO - Transmitiendo total de donantes a todos los suscriptores: 43
```

**Nivel ERROR**: Problemas de conexión

```
ERROR - Error en la conexión WebSocket
ERROR - Frame STOMP incorrecto
```

---

### Logs del Frontend

**Conexión exitosa**:

```
🔗 Connecting to WebSocket: http://localhost:8080/ws
✅ WebSocket connected
```

**Recepción de mensajes**:

```
📊 Total de donantes recibido: 42
Refreshing campaigns in donor dashboard
```

**Errores**:

```
❌ WebSocket connection error: [detalles del error]
⚠️ Cannot subscribe: WebSocket not connected
```

**Desconexión**:

```
🔌 WebSocket disconnected
🔌 Cerrando conexión WebSocket...
```

---

## 🔐 Seguridad

### Consideraciones de seguridad

1. **CORS**: Actualmente configurado con `setAllowedOriginPatterns("*")` para desarrollo
   - **PRODUCCIÓN**: Cambiar a orígenes específicos

```java
registry.addEndpoint("/ws")
        .setAllowedOriginPatterns("https://blood4life.com")
        .withSockJS();
```

2. **Autenticación**: Actualmente no hay autenticación en WebSocket
   - **FUTURO**: Implementar autenticación basada en JWT

3. **Autorización**: Los topics son públicos
   - **FUTURO**: Implementar control de acceso basado en roles

---

## 📊 Rendimiento

### Ventajas

- **Reducción de peticiones HTTP**: En lugar de polling cada X segundos, se usa una sola conexión persistente
- **Menor latencia**: Actualizaciones instantáneas sin delay de polling
- **Menor uso de ancho de banda**: Solo se envían datos cuando hay cambios

### Limitaciones

- **Conexiones simultáneas**: Spring Boot puede manejar miles de conexiones WebSocket simultáneas
- **Escalabilidad**: Para grandes volúmenes, considerar un broker externo como RabbitMQ o Redis Pub/Sub

---

## 🚀 Próximos pasos

### Mejoras planificadas

1. **Notificaciones de campañas**: Broadcast de nuevas campañas
2. **Alertas de urgencia**: Notificaciones push para donaciones críticas
3. **Chat en tiempo real**: Comunicación entre donantes y hospitales
4. **Estado de citas**: Actualizaciones automáticas de citas médicas
5. **Autenticación WebSocket**: Integración con JWT
6. **Broker externo**: Migración a RabbitMQ para mayor escalabilidad

---

## 📚 Referencias

- [Spring WebSocket Documentation](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#websocket)
- [STOMP Protocol](https://stomp.github.io/)
- [SockJS Client](https://github.com/sockjs/sockjs-client)
- [@stomp/stompjs](https://github.com/stomp-js/stompjs)

---

**Documento creado el**: 15 de enero de 2026  
**Autor**: Blood4Life Team  
**Versión**: 1.0
