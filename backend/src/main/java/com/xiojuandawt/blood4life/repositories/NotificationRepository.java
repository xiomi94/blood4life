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
    @Query("SELECT n FROM Notification n WHERE n.received = :donor ORDER BY n.dateNotification DESC")
    List<Notification> findByReceivedOrderByDateNotificationDesc(@Param("donor") BloodDonor donor);

    // Count unread notifications for a specific blood donor
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.received = :donor AND n.read = false")
    Long countUnreadByReceived(@Param("donor") BloodDonor donor);

    // Find unread notifications for a specific blood donor
    @Query("SELECT n FROM Notification n WHERE n.received = :donor AND n.read = false ORDER BY n.dateNotification DESC")
    List<Notification> findUnreadByReceivedOrderByDateNotificationDesc(@Param("donor") BloodDonor donor);

    // Find all notifications for a specific hospital
    @Query("SELECT n FROM Notification n WHERE n.receivedHospital = :hospital ORDER BY n.dateNotification DESC")
    List<Notification> findByReceivedHospitalOrderByDateNotificationDesc(@Param("hospital") Hospital hospital);

    // Count unread notifications for a specific hospital
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.receivedHospital = :hospital AND n.read = false")
    Long countUnreadByReceivedHospital(@Param("hospital") Hospital hospital);

    // Find unread notifications for a specific hospital
    @Query("SELECT n FROM Notification n WHERE n.receivedHospital = :hospital AND n.read = false ORDER BY n.dateNotification DESC")
    List<Notification> findUnreadByReceivedHospitalOrderByDateNotificationDesc(@Param("hospital") Hospital hospital);
}
