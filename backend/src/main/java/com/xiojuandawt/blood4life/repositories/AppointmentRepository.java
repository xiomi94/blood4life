package com.xiojuandawt.blood4life.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.xiojuandawt.blood4life.entities.Appointment;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    Integer countByCampaignId(Integer campaignId);

    // Find appointments by blood donor ID
    List<Appointment> findByBloodDonorId(Integer bloodDonorId);

    // Find appointments by blood donor ID ordered by date descending
    List<Appointment> findByBloodDonorIdOrderByDateAppointmentDesc(Integer bloodDonorId);

    // Count completed donations for a hospital in current month
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.campaign.hospital.id = :hospitalId " +
            "AND a.appointmentStatus.id = 2 " +
            "AND a.dateAppointment >= :monthStart AND a.dateAppointment < :nextMonthStart")
    Long countCompletedDonationsThisMonth(@Param("hospitalId") Integer hospitalId,
            @Param("monthStart") LocalDate monthStart,
            @Param("nextMonthStart") LocalDate nextMonthStart);
}
