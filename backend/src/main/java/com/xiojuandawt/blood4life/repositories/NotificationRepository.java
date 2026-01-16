package com.xiojuandawt.blood4life.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.xiojuandawt.blood4life.entities.BloodDonor;
import com.xiojuandawt.blood4life.entities.Hospital;
import com.xiojuandawt.blood4life.entities.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    // Find all notifications for a specific blood donor, ordered by date (newest
    // first)
    @Query("SELECT n FROM Notification n WHERE n.received = ?1 ORDER BY n.dateNotification DESC")
    List<Notification> findByReceivedOrderByDateNotificationDesc(BloodDonor donor);

    // Count unread notifications for a specific blood donor
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.received = ?1 AND n.read = false")
    Long countUnreadByReceived(BloodDonor donor);

    // Find unread notifications for a specific blood donor
    @Query("SELECT n FROM Notification n WHERE n.received = ?1 AND n.read = false ORDER BY n.dateNotification DESC")
    List<Notification> findUnreadByReceivedOrderByDateNotificationDesc(BloodDonor donor);

    // Find all notifications for a specific hospital
    @Query("SELECT n FROM Notification n WHERE n.receivedHospital = ?1 ORDER BY n.dateNotification DESC")
    List<Notification> findByReceivedHospitalOrderByDateNotificationDesc(Hospital hospital);

    // Count unread notifications for a specific hospital
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.receivedHospital = ?1 AND n.read = false")
    Long countUnreadByReceivedHospital(Hospital hospital);

    // Find unread notifications for a specific hospital
    @Query("SELECT n FROM Notification n WHERE n.receivedHospital = ?1 AND n.read = false ORDER BY n.dateNotification DESC")
    List<Notification> findUnreadByReceivedHospitalOrderByDateNotificationDesc(Hospital hospital);
}
