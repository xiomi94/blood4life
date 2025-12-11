package com.xiojuandawt.blood4life.entities;

import java.time.LocalDate;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "appointment")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "appointment_status_id", nullable = false)
    private AppointmentStatus appointmentStatus;

    @ManyToOne
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    // ...

    public Campaign getCampaign() {
        return campaign;
    }

    public void setCampaign(Campaign campaign) {
        this.campaign = campaign;
    }

    @ManyToOne
    @JoinColumn(name = "blood_donor_id", nullable = false)
    private BloodDonor bloodDonor;

    private String hospitalComment;

    private LocalDate dateAppointment;

    // getters y setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public AppointmentStatus getAppointmentStatus() {
        return appointmentStatus;
    }

    public void setAppointmentStatus(AppointmentStatus appointmentStatus) {
        this.appointmentStatus = appointmentStatus;
    }

    public BloodDonor getBloodDonor() {
        return bloodDonor;
    }

    public void setBloodDonor(BloodDonor bloodDonor) {
        this.bloodDonor = bloodDonor;
    }

    public String getHospitalComment() {
        return hospitalComment;
    }

    public void setHospitalComment(String hospitalComment) {
        this.hospitalComment = hospitalComment;
    }

    public LocalDate getDateAppointment() {
        return dateAppointment;
    }

    public void setDateAppointment(LocalDate dateAppointment) {
        this.dateAppointment = dateAppointment;
    }

    // toString
    @Override
    public String toString() {
        return "Appointment [id=" + id + ", appointmentStatus=" + appointmentStatus +
                bloodDonor + ", hospitalComment=" + hospitalComment + ", dateAppointment="
                + dateAppointment + "]";
    }
}
