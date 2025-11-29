package com.xiojuandawt.blood4life.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xiojuandawt.blood4life.entities.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
