package com.xiojuandawt.blood4life.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xiojuandawt.blood4life.entities.AppointmentStatus;

public interface AppointmentStatusRepository extends JpaRepository<AppointmentStatus, Long> {
}
