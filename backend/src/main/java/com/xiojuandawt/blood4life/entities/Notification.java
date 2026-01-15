package com.xiojuandawt.blood4life.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "notification")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "blood_donor_id", nullable = true)
    private BloodDonor received;

    @ManyToOne
    @JoinColumn(name = "hospital_id", nullable = true)
    private Hospital receivedHospital;

    private String message;

    @Column(name = "created_at")
    private LocalDateTime dateNotification;

    @Column(name = "is_read")
    private boolean read;

    // getters y setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public BloodDonor getReceived() {
        return received;
    }

    public void setReceived(BloodDonor received) {
        this.received = received;
    }

    public Hospital getReceivedHospital() {
        return receivedHospital;
    }

    public void setReceivedHospital(Hospital receivedHospital) {
        this.receivedHospital = receivedHospital;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getDateNotification() {
        return dateNotification;
    }

    public void setDateNotification(LocalDateTime dateNotification) {
        this.dateNotification = dateNotification;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    // toString
    @Override
    public String toString() {
        return "Notification [id=" + id + ", received=" + received + ", receivedHospital=" + receivedHospital
                + ", message=" + message + ", dateNotification="
                + dateNotification + ", read=" + read + "]";
    }
}
