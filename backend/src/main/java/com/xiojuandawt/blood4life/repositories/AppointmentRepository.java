package com.xiojuandawt.blood4life.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xiojuandawt.blood4life.entities.Appointment;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    Integer countByCampaignId(Integer campaignId);

    // Find appointments by blood donor ID
    List<Appointment> findByBloodDonorId(Integer bloodDonorId);

    // Find appointments by blood donor ID ordered by date descending
    List<Appointment> findByBloodDonorIdOrderByDateAppointmentDesc(Integer bloodDonorId);
}
