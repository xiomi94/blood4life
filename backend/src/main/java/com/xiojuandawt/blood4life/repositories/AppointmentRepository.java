package com.xiojuandawt.blood4life.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xiojuandawt.blood4life.entities.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    Integer countByCampaignId(Integer campaignId);
}