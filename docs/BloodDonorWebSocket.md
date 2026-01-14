# Documentación WebSocket - Contador de Donantes en Tiempo Real

## 📋 Índice
1. [¿Qué es WebSocket?](#qué-es-websocket)
2. [¿Para qué lo usamos?](#para-qué-lo-usamos)
3. [Componentes Implementados](#componentes-implementados)
4. [Cómo Funciona](#cómo-funciona)
5. [Configuración](#configuración)
6. [Uso en el Frontend](#uso-en-el-frontend)

---

## ¿Qué es WebSocket?

WebSocket es una tecnología que permite **comunicación bidireccional en tiempo real** entre el navegador (cliente) y el servidor. A diferencia de HTTP tradicional donde el cliente siempre debe hacer una petición, con WebSocket:

- El servidor puede **enviar datos al cliente sin que este los solicite**
- La conexión se mantiene abierta constantemente
- Ideal para aplicaciones que necesitan actualizaciones en tiempo real

### Ejemplo cotidiano
Es como WhatsApp: cuando alguien te envía un mensaje, te llega inmediatamente sin que tengas que recargar la app. Eso es tiempo real.

---

## ¿Para qué lo usamos?

En Blood4Life, usamos WebSocket para mantener actualizado el **contador de donantes totales** en tiempo real.

### Problema que resuelve
Sin WebSocket tendrías que:
- Recargar la página manualmente para ver el contador actualizado
- O hacer peticiones automáticas cada X segundos (ineficiente)

### Con WebSocket
- Cuando un donante se registra o se elimina, **todos los usuarios ven el cambio instantáneamente**
- Sin recargar la página
- Sin consumir recursos haciendo peticiones repetidas

---

## Componentes Implementados

### 1️⃣ Backend

#### `WebSocketConfig.java`
Configuración base de WebSocket en Spring Boot.

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setUserDestinationPrefix("/user");
        config.setApplicationDestinationPrefixes("/app");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
```

**¿Qué hace?**
- Define el endpoint `/ws` donde los clientes se conectan
- Configura prefijos para mensajes (`/app`, `/topic`)
- Habilita SockJS (fallback si el navegador no soporta WebSocket)

---

#### `BloodDonorWebSocketController.java`
Controlador que maneja las peticiones WebSocket.

```java
@Controller
public class BloodDonorWebSocketController {

  @MessageMapping("/getTotalDonors")
  @SendTo("/topic/total-bloodDonors")
  public long getTotalDonors() {
    long totalDonors = bloodDonorRepository.count();
    log.info("Solicitud WebSocket de total de donantes. Devolviendo: {}", totalDonors);
    return totalDonors;
  }

  public void broadcastTotalDonors() {
    long totalDonors = bloodDonorRepository.count();
    log.info("Transmitiendo total de donantes a todos los suscriptores: {}", totalDonors);
    bloodDonorWebSocketService.sentTotalBloodDonors(totalDonors);
  }
}
```

**¿Qué hace cada método?**

| Método | Cuándo se ejecuta | Qué hace |
|--------|-------------------|----------|
| `getTotalDonors()` | Cuando un cliente solicita el total | Consulta BD y devuelve el número actual |
| `broadcastTotalDonors()` | Cuando se crea/elimina un donante | Envía el nuevo total a TODOS los clientes conectados |

---

#### `BloodDonorWebSocketService.java`
Servicio que envía mensajes por WebSocket.

```java
@Service
public class BloodDonorWebSocketService {

  private final SimpMessagingTemplate messagingTemplate;

  public void sentTotalBloodDonors(long totalBloodDonors) {
    log.info("Broadcasting total blood donors to /topic/total-bloodDonors: {}", totalBloodDonors);
    messagingTemplate.convertAndSend("/topic/total-bloodDonors", totalBloodDonors);
  }
}
```

**¿Qué hace?**
- Usa `SimpMessagingTemplate` para enviar mensajes
- Publica el total de donantes en el topic `/topic/total-bloodDonors`
- Todos los clientes suscritos al topic reciben el mensaje

---

#### `BloodDonorServiceImpl.java`
Servicio que se encarga de notificar cuando cambia el total.

```java
@Override
public BloodDonorDTO createNew(BloodDonor bloodDonor) {
  BloodDonor newBloodDonor = this.bloodDonorRepository.save(bloodDonor);

  // Enviar nuevo total por WebSocket
  long totalBloodDonors = bloodDonorRepository.count();
  bloodDonorWebSocketService.sentTotalBloodDonors(totalBloodDonors);

  return this.parseEntityToDto(newBloodDonor);
}

@Override
public void delete(int id) {
  this.bloodDonorRepository.deleteById(id);

  // Enviar nuevo total por WebSocket
  long totalBloodDonors = bloodDonorRepository.count();
  bloodDonorWebSocketService.sentTotalBloodDonors(totalBloodDonors);
}
```

**¿Qué hace?**
Después de crear o eliminar un donante:
1. Cuenta el total de donantes
2. Envía el nuevo total por WebSocket a todos los clientes

---

### 2️⃣ Frontend

#### `useTotalBloodDonors.ts`
Hook de React que gestiona la conexión WebSocket.

```typescript
export const useTotalDonors = () => {
  const [totalDonors, setTotalDonors] = useState(0);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');

    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('✅ WebSocket conectado al servidor');

        // Suscribirse para recibir actualizaciones
        client.subscribe('/topic/total-bloodDonors', (message) => {
          console.log('📊 Total de donantes recibido:', message.body);
          setTotalDonors(Number(message.body));
        });

        // Solicitar el total actual
        client.publish({
          destination: '/app/getTotalDonors',
          body: '',
        });
      }
    });

    client.activate();
    return () => client.deactivate();
  }, []);

  return totalDonors;
};
```

**¿Qué hace?**
1. **Conecta** al servidor WebSocket (`/ws`)
2. **Se suscribe** al topic `/topic/total-bloodDonors`
3. **Solicita** el total actual al conectarse
4. **Actualiza** el estado cuando recibe mensajes
5. **Desconecta** cuando el componente se desmonta

---

#### `DashboardBloodDonorPage.tsx`
Componente que usa el hook.

```typescript
const DashboardBloodDonorPage = () => {
  const totalDonors = useTotalDonors();

  return (
    <StatsCards bloodDonorsCounter={totalDonors} ... />
  );
};
```

**¿Qué hace?**
- Llama al hook `useTotalDonors()`
- Pasa el total al componente `StatsCards`
- El valor se actualiza automáticamente en tiempo real

---

## Cómo Funciona

### Flujo Completo

```
1. CONEXIÓN INICIAL
   Cliente (React) → Conecta a ws://localhost:8080/ws
                  ↓
   Cliente → Se suscribe a /topic/total-bloodDonors
                  ↓
   Cliente → Solicita total: /app/getTotalDonors
                  ↓
   Servidor → Cuenta donantes en BD: 42
                  ↓
   Servidor → Envía respuesta: 42
                  ↓
   Cliente → Muestra en pantalla: 42


2. CREAR NUEVO DONANTE
   Usuario → Registra nuevo donante
                  ↓
   Backend → Guarda en base de datos
                  ↓
   BloodDonorService → Cuenta total: 43
                  ↓
   BloodDonorService → Envía por WebSocket a todos
                  ↓
   Todos los clientes → Actualizan contador: 43


3. ELIMINAR DONANTE
   Admin → Elimina un donante
                  ↓
   Backend → Elimina de base de datos
                  ↓
   BloodDonorService → Cuenta total: 42
                  ↓
   BloodDonorService → Envía por WebSocket a todos
                  ↓
   Todos los clientes → Actualizan contador: 42
```

---

## Configuración

### Rutas WebSocket

| Tipo | Ruta | Descripción |
|------|------|-------------|
| **Conexión** | `ws://localhost:8080/ws` | Endpoint para establecer conexión WebSocket |
| **Solicitud** | `/app/getTotalDonors` | Cliente solicita total actual de donantes |
| **Suscripción** | `/topic/total-bloodDonors` | Topic donde se publican las actualizaciones |

### Dependencias Necesarias

**Backend (pom.xml)**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

**Frontend (package.json)**
```json
{
  "sockjs-client": "^1.6.1",
  "@stomp/stompjs": "^7.0.0"
}
```

---

## Uso en el Frontend

### Paso 1: Importar el hook
```typescript
import { useTotalDonors } from '../../hooks/useTotalBloodDonors';
```

### Paso 2: Usar en el componente
```typescript
const MyComponent = () => {
  const totalDonors = useTotalDonors();
  
  return (
    <div>
      <h1>Total de Donantes: {totalDonors}</h1>
    </div>
  );
};
```

### Paso 3: ¡Listo!
El número se actualiza automáticamente cuando:
- Se registra un nuevo donante
- Se elimina un donante existente
- Sin necesidad de recargar la página

---

## Ventajas de esta Implementación

✅ **Tiempo real**: Actualizaciones instantáneas sin recargar  
✅ **Eficiente**: Una sola conexión permanente vs. múltiples peticiones HTTP  
✅ **Escalable**: Funciona con múltiples clientes simultáneamente  
✅ **Simple**: Hook reutilizable, fácil de usar en cualquier componente  
✅ **Mantenible**: Lógica separada en capas (Controller, Service, Hook)

---

## Logs de Ejemplo

### Servidor (Backend)
```
Solicitud WebSocket de total de donantes. Devolviendo: 42
Transmitiendo total de donantes a todos los suscriptores: 43
```

### Cliente (Frontend)
```
✅ WebSocket conectado al servidor
📊 Total de donantes recibido: 42
📊 Total de donantes recibido: 43
```

---

## Resumen

WebSocket nos permite tener un **contador de donantes en tiempo real** que se actualiza automáticamente en todos los navegadores conectados cuando alguien se registra o se elimina de la base de datos. Es eficiente, rápido y mejora la experiencia del usuario al no tener que recargar la página manualmente.
