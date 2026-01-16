package com.xiojuandawt.blood4life.entities;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "appointment_status")
public class AppointmentStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String statusName;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "appointmentStatus")
    private List<Appointment> appointments;

    public AppointmentStatus() {
    }

    public AppointmentStatus(String statusName, List<Appointment> appointments) {
        this.statusName = statusName;
        this.appointments = appointments;
    }

    public AppointmentStatus(Integer id, String statusName, List<Appointment> appointments) {
        this.id = id;
        this.statusName = statusName;
        this.appointments = appointments;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getStatusName() {
        return statusName;
    }

    public void setStatusName(String statusName) {
        this.statusName = statusName;
    }

    @com.fasterxml.jackson.annotation.JsonIgnore
    public List<Appointment> getAppointments() {
        return appointments;
    }

    public void setAppointments(List<Appointment> appointments) {
        this.appointments = appointments;
    }

    // toString
    @Override
    public String toString() {
        return "AppointmentStatus [id=" + id + ", statusName=" + statusName + "]";
    }
}
