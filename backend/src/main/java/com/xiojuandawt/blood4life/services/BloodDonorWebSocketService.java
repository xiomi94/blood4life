package com.xiojuandawt.blood4life.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

@Service
public class BloodDonorWebSocketService {

  private static final Logger log = LoggerFactory.getLogger(BloodDonorWebSocketService.class);

  private final SimpMessagingTemplate messagingTemplate;

  public BloodDonorWebSocketService(SimpMessagingTemplate messagingTemplate) {
    this.messagingTemplate = messagingTemplate;
  }

  public void sentTotalBloodDonors(long totalBloodDonors) {
    log.info("Broadcasting total blood donors to /topic/total-bloodDonors: {}", totalBloodDonors);
    messagingTemplate.convertAndSend("/topic/total-bloodDonors", totalBloodDonors);
  }

  @EventListener
  public void handleWebSocketConnect(SessionConnectedEvent event) {

    StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());

    String sessionId = accessor.getSessionId();
    String principalName = accessor.getUser() != null ? accessor.getUser().getName() : null;

    log.info("WebSocket connected: sessionId={}, principalName={}", sessionId, principalName);

    if (principalName != null) {
      // Prefer sending to the authenticated principal name
      messagingTemplate.convertAndSendToUser(
        principalName,
        "/topic/total-bloodDonors",
        "Bienvenido, conexión establecida"
      );
      log.info("Sent welcome message to principal '{}' on /topic/total-bloodDonors", principalName);
    } else {
      // If no principal, try to send targeting the session id via headers
      log.warn("No Principal found for session {}. Sending message using sessionId header (may not be routed by /user prefix).", sessionId);
      SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create();
      headerAccessor.setSessionId(sessionId);
      headerAccessor.setLeaveMutable(true);
      messagingTemplate.convertAndSendToUser(
        sessionId,
        "/topic/total-bloodDonors",
        "Bienvenido, conexión establecida",
        headerAccessor.getMessageHeaders()
      );
    }
  }
}
