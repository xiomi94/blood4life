package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.repositories.BloodDonorRepository;
import com.xiojuandawt.blood4life.services.BloodDonorWebSocketService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class BloodDonorWebSocketController {

  private static final Logger log = LoggerFactory.getLogger(BloodDonorWebSocketController.class);

  @Autowired
  private BloodDonorRepository bloodDonorRepository;

  @Autowired
  private BloodDonorWebSocketService bloodDonorWebSocketService;

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
