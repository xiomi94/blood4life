package com.xiojuandawt.blood4life.services;

import com.xiojuandawt.blood4life.entities.BloodDonor;
import com.xiojuandawt.blood4life.entities.Notification;

import java.util.List;
import java.util.Optional;

import com.xiojuandawt.blood4life.entities.Hospital;

public interface NotificationService {

    // Get all notifications for a specific blood donor
    List<Notification> getNotificationsByDonor(BloodDonor donor);

    // Get unread notifications count for a specific blood donor
    Long getUnreadCount(BloodDonor donor);

    // Get unread notifications for a specific blood donor
    List<Notification> getUnreadNotifications(BloodDonor donor);

    // Get all notifications for a specific hospital
    List<Notification> getNotificationsByHospital(Hospital hospital);

    // Get unread notifications count for a specific hospital
    Long getUnreadCount(Hospital hospital);

    // Get unread notifications for a specific hospital
    List<Notification> getUnreadNotifications(Hospital hospital);

    // Mark a notification as read
    Optional<Notification> markAsRead(Integer notificationId);

    // Mark all notifications as read for a specific donor
    void markAllAsRead(BloodDonor donor);

    // Mark all notifications as read for a specific hospital
    void markAllAsRead(Hospital hospital);

    // Create a new notification for donor
    Notification createNotification(BloodDonor receiver, String message);

    // Create a new notification for hospital
    Notification createNotification(Hospital receiver, String message);
}
