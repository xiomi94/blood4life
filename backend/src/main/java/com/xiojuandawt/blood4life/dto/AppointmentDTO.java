package com.xiojuandawt.blood4life.dto;

import com.xiojuandawt.blood4life.entities.AppointmentStatus;

import java.time.LocalDate;

public class AppointmentDTO {

  private Integer id;
  private AppointmentStatus appointmentStatus;
  private Integer campaignId;
  private Integer bloodDonorId;

  private String hospitalComment;
  private LocalDate dateAppointment;

  public AppointmentDTO() {
  }

  public AppointmentDTO(Integer id, AppointmentStatus appointmentStatus, Integer campaignId,
                        Integer bloodDonorId, String hospitalComment, LocalDate dateAppointment) {
    this.id = id;
    this.appointmentStatus = appointmentStatus;
    this.campaignId = campaignId;
    this.bloodDonorId = bloodDonorId;
    this.hospitalComment = hospitalComment;
    this.dateAppointment = dateAppointment;
  }

  public Integer getId() {
    return this.id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public AppointmentStatus getAppointmentStatus() {
    return this.appointmentStatus;
  }

  public void setAppointmentStatus(AppointmentStatus appointmentStatus) {
    this.appointmentStatus = appointmentStatus;
  }

  public Integer getCampaignId() {
    return this.campaignId;
  }

  public void setCampaignId(Integer campaignId) {
    this.campaignId = campaignId;
  }

  public Integer getBloodDonorId() {
    return this.bloodDonorId;
  }

  public void setBloodDonorId(Integer bloodDonorId) {
    this.bloodDonorId = bloodDonorId;
  }

  public String getHospitalComment() {
    return this.hospitalComment;
  }

  public void setHospitalComment(String hospitalComment) {
    this.hospitalComment = hospitalComment;
  }

  public LocalDate getDateAppointment() {
    return this.dateAppointment;
  }

  public void setDateAppointment(LocalDate dateAppointment) {
    this.dateAppointment = dateAppointment;
  }
}
