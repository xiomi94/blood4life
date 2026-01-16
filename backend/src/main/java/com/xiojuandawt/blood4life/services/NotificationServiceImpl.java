package com.xiojuandawt.blood4life.services;

import com.xiojuandawt.blood4life.entities.BloodDonor;
import com.xiojuandawt.blood4life.entities.Hospital;
import com.xiojuandawt.blood4life.entities.Notification;
import com.xiojuandawt.blood4life.repositories.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    public List<Notification> getNotificationsByDonor(BloodDonor donor) {
        return notificationRepository.findByReceivedOrderByDateNotificationDesc(donor);
    }

    @Override
    public Long getUnreadCount(BloodDonor donor) {
        return notificationRepository.countUnreadByReceived(donor);
    }

    @Override
    public List<Notification> getUnreadNotifications(BloodDonor donor) {
        return notificationRepository.findUnreadByReceivedOrderByDateNotificationDesc(donor);
    }

    @Override
    public List<Notification> getNotificationsByHospital(Hospital hospital) {
        return notificationRepository.findByReceivedHospitalOrderByDateNotificationDesc(hospital);
    }

    @Override
    public Long getUnreadCount(Hospital hospital) {
        return notificationRepository.countUnreadByReceivedHospital(hospital);
    }

    @Override
    public List<Notification> getUnreadNotifications(Hospital hospital) {
        return notificationRepository.findUnreadByReceivedHospitalOrderByDateNotificationDesc(hospital);
    }

    @Override
    @Transactional
    public Optional<Notification> markAsRead(Integer notificationId) {
        Optional<Notification> notification = notificationRepository.findById(notificationId);
        notification.ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
        return notification;
    }

    @Override
    @Transactional
    public void markAllAsRead(BloodDonor donor) {
        List<Notification> unreadNotifications = getUnreadNotifications(donor);
        unreadNotifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }

    @Override
    @Transactional
    public void markAllAsRead(Hospital hospital) {
        List<Notification> unreadNotifications = getUnreadNotifications(hospital);
        unreadNotifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }

    @Override
    @Transactional
    public Notification createNotification(BloodDonor receiver, String message) {
        Notification notification = new Notification();
        notification.setReceived(receiver);
        notification.setMessage(message);
        notification.setDateNotification(LocalDateTime.now());
        notification.setRead(false);
        Notification saved = notificationRepository.save(notification);
        messagingTemplate.convertAndSend("/topic/notifications/donor/" + receiver.getId(), saved);
        return saved;
    }

    @Override
    @Transactional
    public Notification createNotification(Hospital receiver, String message) {
        Notification notification = new Notification();
        notification.setReceivedHospital(receiver);
        notification.setMessage(message);
        notification.setDateNotification(LocalDateTime.now());
        notification.setRead(false);
        Notification saved = notificationRepository.save(notification);
        messagingTemplate.convertAndSend("/topic/notifications/hospital/" + receiver.getId(), saved);
        return saved;
    }
}
