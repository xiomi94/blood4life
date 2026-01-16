package com.xiojuandawt.blood4life.services;

import com.xiojuandawt.blood4life.dto.AppointmentDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class HospitalWebSocketService {

    private static final Logger log = LoggerFactory.getLogger(HospitalWebSocketService.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Notifica a todos los suscriptores (hospitales) sobre una nueva cita o
     * actualización.
     * Idealmente debería ser a un tópico específico del hospital, pero mantenemos
     * compatibilidad por ahora.
     * 
     * @param appointmentDTO La cita actualizada
     */
    public void notifyAppointmentUpdate(AppointmentDTO appointmentDTO) {
        log.info("Broadcasting appointment update to /topic/appointments: ID {}", appointmentDTO.getId());
        messagingTemplate.convertAndSend("/topic/appointments", appointmentDTO);
    }

    /**
     * Notifica actualizaciones estadísticas del dashboard
     * 
     * @param hospitalId ID del hospital
     * @param stats      Objeto de estadísticas
     */
    public void notifyDashboardStats(Integer hospitalId, Object stats) {
        String destination = "/topic/hospital/" + hospitalId + "/stats";
        log.info("Sending stats update to {}", destination);
        messagingTemplate.convertAndSend(destination, stats);
    }
}
