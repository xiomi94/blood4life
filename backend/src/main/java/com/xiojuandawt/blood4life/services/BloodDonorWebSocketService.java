package com.xiojuandawt.blood4life.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class BloodDonorWebSocketService {

  private static final Logger log = LoggerFactory.getLogger(BloodDonorWebSocketService.class);

  @Autowired
  private SimpMessagingTemplate messagingTemplate;

  public void sentTotalBloodDonors(long totalBloodDonors) {
    log.info("Broadcasting total blood donors to all subscribers: {}", totalBloodDonors);
    messagingTemplate.convertAndSend("/topic/total-bloodDonors", totalBloodDonors);
  }
}
