package com.xiojuandawt.blood4life.services;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

@Service
public class BloodDonorWebSocketService {

  private final SimpMessagingTemplate messagingTemplate;

  public BloodDonorWebSocketService(SimpMessagingTemplate messagingTemplate) {
    this.messagingTemplate = messagingTemplate;
  }

  public void sentTotalBloodDonors(long totalBloodDonors) {
    messagingTemplate.convertAndSend("/topic/total-bloodDonors", totalBloodDonors);
  }

  @EventListener
  public void handleWebSocketConnect(SessionConnectedEvent event) {

    StompHeaderAccessor accessor =
      StompHeaderAccessor.wrap(event.getMessage());

    String sessionId = accessor.getSessionId();

    messagingTemplate.convertAndSendToUser(
      sessionId,
      "/topic/total-bloodDonors",
      "Bienvenido, conexión establecida"
    );
  }
}
