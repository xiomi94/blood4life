# Implementación de Notificaciones Push para Donantes

Esta documentación detalla cómo funcionan las notificaciones en tiempo real ("push") para los donantes en Blood4Life. El sistema permite que un donante reciba alertas instantáneas (por ejemplo, cuando se crea una nueva campaña compatible con su tipo de sangre) sin necesidad de recargar la página.

## Flujo de Trabajo

La comunicación se realiza mediante **WebSockets** utilizando el protocolo STOMP.

1.  **Backend**: Crea la notificación y la "empuja" a un canal específico para ese usuario.
2.  **Frontend**: Se suscribe a ese canal privado y escucha los mensajes entrantes.

---

## Paso 1: Configuración del WebSocket (Backend)

Primero, habilitamos el soporte de WebSockets en Spring Boot con un Broker de mensajes simple.

**Archivo:** `backend/.../config/WebSocketConfig.java`

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Habilita un broker simple en memoria para enviar mensajes a los clientes
        config.enableSimpleBroker("/topic");
        // Prefijo para los mensajes que van DEL cliente AL servidor
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Punto de entrada para la conexión WebSocket
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }
}
```

## Paso 2: Servicio de Envío (Backend)

Cuando ocurre un evento que requiere notificación (ej. nueva campaña), usamos `NotificationServiceImpl`. Aquí es donde ocurre la "magia" del Push.

**Archivo:** `backend/.../services/NotificationServiceImpl.java`

Hemos inyectado `SimpMessagingTemplate` para enviar mensajes proactivamente.

```java
@Autowired
private SimpMessagingTemplate messagingTemplate;

@Override
@Transactional
public Notification createNotification(BloodDonor receiver, String message) {
    // 1. Guardar la notificación en la Base de Datos (Persistencia)
    Notification notification = new Notification();
    notification.setReceived(receiver);
    notification.setMessage(message);
    notification.setDateNotification(LocalDateTime.now());
    notification.setRead(false);
    Notification saved = notificationRepository.save(notification);

    // 2. ENVIAR PUSH (Tiempo Real)
    // Enviamos el objeto guardado al canal específico de este donante.
    // El formato del canal es: /topic/notifications/donor/{ID_DONANTE}
    messagingTemplate.convertAndSend("/topic/notifications/donor/" + receiver.getId(), saved);

    return saved;
}
```

*   **Lo que se añadió**: La línea `messagingTemplate.convertAndSend(...)` es la clave. Envía el objeto `saved` (serializado a JSON) a cualquier cliente suscrito a ese topic específico.

## Paso 3: Hook de Notificaciones (Frontend Clientside)

En el frontend, creamos un hook personalizado `useNotifications` que maneja toda la lógica: estado, carga inicial (REST) y suscripción en vivo (WebSocket).

**Archivo:** `frontend/src/hooks/useNotifications.ts`

```typescript
// ... imports

export const useNotifications = () => {
    const { user, userType } = useAuth();
    const { subscribe, isConnected } = useWebSocket(); // Hook auxiliar para manejar conexión STOMP
    const [notifications, setNotifications] = useState<Notification[]>([]);
    
    // ... lógica de fetch inicial ...

    // EFECTO DE SUSCRIPCIÓN
    useEffect(() => {
        // Solo nos suscribimos si estamos autenticados y conectados al socket
        if (isConnected && user?.id && userType === 'donante') {
            
            // Construimos el topic específico para este usuario
            const topic = `/topic/notifications/donor/${user.id}`;

            console.log('🔔 Suscribiéndose a:', topic);

            // Nos suscribimos al canal
            const unsubscribe = subscribe(topic, (message) => {
                if (message.body) {
                    // Cuando llega un mensaje, lo parseamos
                    const newNotification = JSON.parse(message.body);

                    // Y actualizamos el estado LOCAL inmediatamente
                    setNotifications(prev => [newNotification, ...prev]);
                    setUnreadCount(prev => prev + 1);
                    
                    // Opcional: Sonido o Toast de alerta
                }
            });

            return () => {
                if (unsubscribe) unsubscribe();
            };
        }
    }, [isConnected, user, subscribe]); // Re-ejecutar si cambia la conexión o el usuario

    return { notifications, unreadCount, ... };
};
```

*   **Lo que se añadió**: La lógica dentro del `useEffect` que escucha el evento `subscribe`. Al recibir el mensaje, actualizamos el estado de React (`setNotifications`) con el nuevo dato *sin hacer una nueva petición HTTP* al servidor.

## Resumen

Gracias a esta arquitectura:
1.  El servidor guarda la notificación y la emite.
2.  El cliente recibe el JSON instantáneamente.
3.  La interfaz se actualiza sola (el contador de la campana sube, la lista crece) casi instantáneamente.
