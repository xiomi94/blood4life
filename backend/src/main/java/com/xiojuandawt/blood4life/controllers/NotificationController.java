package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.entities.BloodDonor;
import com.xiojuandawt.blood4life.entities.Hospital;
import com.xiojuandawt.blood4life.entities.Notification;
import com.xiojuandawt.blood4life.exception.ResourceNotFoundException;
import com.xiojuandawt.blood4life.services.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * Get all notifications for the authenticated user (donor or hospital)
     */
    @GetMapping
    public ResponseEntity<?> getMyNotifications(Authentication authentication) {
        try {
            Object principal = authentication.getPrincipal();

            if (principal instanceof BloodDonor) {
                return ResponseEntity.ok(notificationService.getNotificationsByDonor((BloodDonor) principal));
            } else if (principal instanceof Hospital) {
                return ResponseEntity.ok(notificationService.getNotificationsByHospital((Hospital) principal));
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Tipo de usuario no soportado para notificaciones");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener las notificaciones: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get the count of unread notifications for the authenticated user
     */
    @GetMapping("/unread/count")
    public ResponseEntity<?> getUnreadCount(Authentication authentication) {
        try {
            Object principal = authentication.getPrincipal();
            Long count = 0L;

            // Logs eliminados para producción

            if (principal instanceof BloodDonor) {
                count = notificationService.getUnreadCount((BloodDonor) principal);
            } else if (principal instanceof Hospital) {
                Integer hId = ((Hospital) principal).getId();
                count = notificationService.getUnreadCount((Hospital) principal);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Tipo de usuario no soportado");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            }

            Map<String, Long> response = new HashMap<>();
            response.put("count", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener el conteo de notificaciones: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get all unread notifications for the authenticated user
     */
    @GetMapping("/unread")
    public ResponseEntity<?> getUnreadNotifications(Authentication authentication) {
        try {
            Object principal = authentication.getPrincipal();
            List<Notification> notifications;

            if (principal instanceof BloodDonor) {
                notifications = notificationService.getUnreadNotifications((BloodDonor) principal);
            } else if (principal instanceof Hospital) {
                notifications = notificationService.getUnreadNotifications((Hospital) principal);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Tipo de usuario no soportado");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            }

            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener las notificaciones no leídas: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Mark a specific notification as read
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Integer id,
            Authentication authentication) {
        try {
            // Verificar autenticación (cualquier usuario autenticado puede intentar marcar,
            // idealmente verificaríamos que la notificación le pertenece, pero por ahora lo
            // dejamos genérico)
            if (authentication.getPrincipal() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Notification notification = notificationService.markAsRead(id)
                    .orElseThrow(() -> new ResourceNotFoundException());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Notificación marcada como leída");
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Notificación no encontrada");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al marcar la notificación como leída: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Mark all notifications as read for the authenticated user
     */
    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(Authentication authentication) {
        try {
            Object principal = authentication.getPrincipal();

            if (principal instanceof BloodDonor) {
                notificationService.markAllAsRead((BloodDonor) principal);
            } else if (principal instanceof Hospital) {
                notificationService.markAllAsRead((Hospital) principal);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Tipo de usuario no soportado");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            }

            Map<String, String> response = new HashMap<>();
            response.put("message", "Todas las notificaciones marcadas como leídas");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al marcar todas las notificaciones como leídas: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
