package com.xiojuandawt.blood4life.dto;

import com.xiojuandawt.blood4life.entities.AppointmentStatus;

import java.time.LocalDate;

public class AppointmentDTO {

  private Integer id;
  private AppointmentStatus appointmentStatus;
  private Integer campaignId;
  private Integer bloodDonorId;

  private String hospitalComment;

  @com.fasterxml.jackson.annotation.JsonFormat(shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
  private LocalDate dateAppointment;

  @com.fasterxml.jackson.annotation.JsonFormat(shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING, pattern = "HH:mm")
  private java.time.LocalTime hourAppointment;

  private BloodDonorDTO bloodDonor;
  private Long donorCompletedAppointments;
  private String campaignName;

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

  public java.time.LocalTime getHourAppointment() {
    return hourAppointment;
  }

  public void setHourAppointment(java.time.LocalTime hourAppointment) {
    this.hourAppointment = hourAppointment;
  }

  public BloodDonorDTO getBloodDonor() {
    return bloodDonor;
  }

  public void setBloodDonor(BloodDonorDTO bloodDonor) {
    this.bloodDonor = bloodDonor;
  }

  public Long getDonorCompletedAppointments() {
    return donorCompletedAppointments;
  }

  public void setDonorCompletedAppointments(Long donorCompletedAppointments) {
    this.donorCompletedAppointments = donorCompletedAppointments;
  }

  public String getCampaignName() {
    return campaignName;
  }

  public void setCampaignName(String campaignName) {
    this.campaignName = campaignName;
  }
}
