package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.dto.AppointmentDTO;
import com.xiojuandawt.blood4life.entities.Appointment;
import com.xiojuandawt.blood4life.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {
  // Controller for managing appointments

  @Autowired
  private AppointmentRepository appointmentRepository;

  @Autowired
  private AppointmentStatusRepository appointmentStatusRepository;

  @Autowired
  private CampaignRepository campaignRepository;

  @Autowired
  private BloodDonorRepository bloodDonorRepository;

  @GetMapping("/all")
  public List<AppointmentDTO> getAllAppointments() {
    List<Appointment> appointments = appointmentRepository.findAll();
    List<AppointmentDTO> dtoList = new ArrayList<>();

    for (Appointment appointment : appointments) {
      AppointmentDTO dto = new AppointmentDTO();
      dto.setId(appointment.getId());
      dto.setAppointmentStatus(appointment.getAppointmentStatus()); // Tu DTO usa objeto
      dto.setCampaignId(appointment.getCampaign().getId());
      dto.setBloodDonorId(appointment.getBloodDonor().getId());
      dto.setHospitalComment(appointment.getHospitalComment());
      dto.setDateAppointment(appointment.getDateAppointment());

      dtoList.add(dto);
    }

    return dtoList;
  }

  @GetMapping("/{id}")
  public ResponseEntity<AppointmentDTO> getAppointmentById(
      @PathVariable Integer id) {

    Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);

    if (optionalAppointment.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    Appointment appointment = optionalAppointment.get();

    AppointmentDTO dto = new AppointmentDTO();

    dto.setId(appointment.getId());
    dto.setAppointmentStatus(appointment.getAppointmentStatus()); // âœ” correcto
    dto.setCampaignId(appointment.getCampaign().getId());
    dto.setBloodDonorId(appointment.getBloodDonor().getId());
    dto.setHospitalComment(appointment.getHospitalComment());
    dto.setDateAppointment(appointment.getDateAppointment());

    return ResponseEntity.ok(dto);
  }

  @Autowired
  private com.xiojuandawt.blood4life.services.HospitalWebSocketService hospitalWebSocketService;

  @Autowired
  private com.xiojuandawt.blood4life.services.NotificationService notificationService;

  @PostMapping("/create")
  public ResponseEntity<AppointmentDTO> createAppointment(
      @RequestBody AppointmentDTO dto) {
    Appointment appointment = new Appointment();

    appointment.setAppointmentStatus(
        appointmentStatusRepository.findById(dto.getAppointmentStatus().getId())
            .orElseThrow(() -> new RuntimeException("Estado no encontrado")));

    appointment.setCampaign(
        campaignRepository.findById(dto.getCampaignId())
            .orElseThrow(() -> new RuntimeException("Campaña no encontrada")));

    appointment.setBloodDonor(
        bloodDonorRepository.findById(dto.getBloodDonorId())
            .orElseThrow(() -> new RuntimeException("Donante no encontrado")));

    appointment.setHospitalComment(dto.getHospitalComment());
    appointment.setDateAppointment(dto.getDateAppointment());

    // Set default hour if not present (e.g. 09:00 AM)
    if (dto.getHourAppointment() != null) {
      appointment.setHourAppointment(dto.getHourAppointment());
    } else {
      appointment.setHourAppointment(java.time.LocalTime.of(9, 0));
    }

    Appointment saved = appointmentRepository.save(appointment);

    // --- Convert entity -> DTO ---
    AppointmentDTO result = new AppointmentDTO();
    result.setId(saved.getId());
    result.setAppointmentStatus(saved.getAppointmentStatus());
    result.setCampaignId(saved.getCampaign().getId());
    result.setCampaignName(saved.getCampaign().getName());
    result.setBloodDonorId(saved.getBloodDonor().getId());
    result.setHospitalComment(saved.getHospitalComment());
    result.setDateAppointment(saved.getDateAppointment());
    result.setHourAppointment(saved.getHourAppointment());

    // Fill donor info
    com.xiojuandawt.blood4life.entities.BloodDonor donor = saved.getBloodDonor();
    com.xiojuandawt.blood4life.dto.BloodDonorDTO donorDTO = new com.xiojuandawt.blood4life.dto.BloodDonorDTO();
    donorDTO.setId(donor.getId());
    donorDTO.setFirstName(donor.getFirstName());
    donorDTO.setLastName(donor.getLastName());
    donorDTO.setEmail(donor.getEmail());
    result.setBloodDonor(donorDTO);

    // Notify Hospital (Internal)
    try {
      if (saved.getCampaign().getHospital() != null) {
        System.out.println("DEBUG: Notificando a Hospital ID: " + saved.getCampaign().getHospital().getId());
      } else {
        System.out.println("DEBUG: ERROR - La campaña no tiene hospital asignado!");
      }

      String title = "Nueva inscripción del donante " + donor.getFirstName() + " a la campaña "
          + saved.getCampaign().getName();

      String jsonDetail = "{" +
          "\"nombre\": \"" + donor.getFirstName() + " " + donor.getLastName() + "\"," +
          "\"dni\": \"" + donor.getDni() + "\"," +
          "\"tipoSangre\": \"" + donor.getBloodType().getType() + "\"," +
          "\"campaignName\": \"" + saved.getCampaign().getName() + "\"," +
          "\"fecha\": \"" + saved.getDateAppointment() + "\"," +
          "\"hora\": \"" + saved.getHourAppointment() + "\"" +
          "}";

      String msg = title + "|" + jsonDetail;
      notificationService.createNotification(saved.getCampaign().getHospital(), msg);
      System.out.println("DEBUG: Notificación creada exitosamente.");
    } catch (Exception e) {
      System.err.println("Error creando notificación interna: " + e.getMessage());
      e.printStackTrace();
    }

    // Notificar vía WebSocket
    hospitalWebSocketService.notifyAppointmentUpdate(result);

    return ResponseEntity.ok(result);
  }

  @PutMapping("/update/{id}")
  public ResponseEntity<AppointmentDTO> updateAppointment(
      @PathVariable Integer id,
      @RequestBody AppointmentDTO dto) {

    Optional<Appointment> optional = appointmentRepository.findById(id);

    if (optional.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    Appointment appointment = optional.get();

    // Update fields
    appointment.setAppointmentStatus(
        appointmentStatusRepository.findById(dto.getAppointmentStatus().getId())
            .orElseThrow(() -> new RuntimeException("Estado no encontrado")));

    appointment.setCampaign(
        campaignRepository.findById(dto.getCampaignId())
            .orElseThrow(() -> new RuntimeException("Campaña no encontrada")));

    appointment.setBloodDonor(
        bloodDonorRepository.findById(dto.getBloodDonorId())
            .orElseThrow(() -> new RuntimeException("Donante no encontrado")));

    appointment.setHospitalComment(dto.getHospitalComment());
    appointment.setDateAppointment(dto.getDateAppointment());

    Appointment updated = appointmentRepository.save(appointment);

    // Convert entity -> DTO
    AppointmentDTO result = new AppointmentDTO();
    result.setId(updated.getId());
    result.setAppointmentStatus(updated.getAppointmentStatus());
    result.setCampaignId(updated.getCampaign().getId());
    result.setCampaignName(updated.getCampaign().getName());
    result.setBloodDonorId(updated.getBloodDonor().getId());
    result.setHospitalComment(updated.getHospitalComment());
    result.setDateAppointment(updated.getDateAppointment());
    result.setHourAppointment(updated.getHourAppointment());

    // Notificar vía WebSocket
    hospitalWebSocketService.notifyAppointmentUpdate(result);

    return ResponseEntity.ok(result);
  }

  @DeleteMapping("delete/{id}")
  public ResponseEntity<Void> deleteAppointment(
      @PathVariable Integer id) {

    if (!appointmentRepository.existsById(id)) {
      return ResponseEntity.notFound().build();
    }

    appointmentRepository.deleteById(id);

    return ResponseEntity.noContent().build();
  }

  @GetMapping("/donor/{donorId}")
  public List<AppointmentDTO> getAppointmentsByDonor(
      @PathVariable Integer donorId) {
    List<Appointment> appointments = appointmentRepository
        .findByBloodDonorIdOrderByDateAppointmentDesc(donorId);
    List<AppointmentDTO> dtoList = new ArrayList<>();

    for (Appointment appointment : appointments) {
      AppointmentDTO dto = new AppointmentDTO();
      dto.setId(appointment.getId());
      dto.setAppointmentStatus(appointment.getAppointmentStatus());
      dto.setCampaignId(appointment.getCampaign().getId());
      dto.setBloodDonorId(appointment.getBloodDonor().getId());
      dto.setHospitalComment(appointment.getHospitalComment());
      dto.setDateAppointment(appointment.getDateAppointment());

      dtoList.add(dto);
    }

    return dtoList;
  }

  @GetMapping("/hospital/{hospitalId}/monthly-donations")
  public ResponseEntity<Long> getMonthlyDonationsByHospital(
      @PathVariable Integer hospitalId) {
    java.time.LocalDate now = java.time.LocalDate.now();
    java.time.LocalDate monthStart = now.withDayOfMonth(1);
    java.time.LocalDate nextMonthStart = monthStart.plusMonths(1);

    Long count = appointmentRepository.countCompletedDonationsThisMonth(
        hospitalId, monthStart, nextMonthStart);

    return ResponseEntity.ok(count != null ? count : 0L);
  }

  @GetMapping("/hospital/{hospitalId}/today")
  public ResponseEntity<List<AppointmentDTO>> getTodayAppointmentsByHospital(
      @PathVariable Integer hospitalId) {
    java.time.LocalDate today = java.time.LocalDate.now();
    List<Appointment> appointments = appointmentRepository
        .findByCampaignHospitalIdAndDateAppointment(hospitalId, today);

    List<AppointmentDTO> dtoList = new ArrayList<>();

    for (Appointment appointment : appointments) {
      AppointmentDTO dto = new AppointmentDTO();
      dto.setId(appointment.getId());
      dto.setAppointmentStatus(appointment.getAppointmentStatus());
      dto.setCampaignId(appointment.getCampaign().getId());
      dto.setBloodDonorId(appointment.getBloodDonor().getId());
      dto.setHospitalComment(appointment.getHospitalComment());
      dto.setDateAppointment(appointment.getDateAppointment());
      dto.setHourAppointment(appointment.getHourAppointment());

      // Create BloodDonorDTO
      com.xiojuandawt.blood4life.entities.BloodDonor donor = appointment.getBloodDonor();
      com.xiojuandawt.blood4life.dto.BloodDonorDTO donorDTO = new com.xiojuandawt.blood4life.dto.BloodDonorDTO(
          donor.getId(),
          donor.getDni(),
          donor.getFirstName(),
          donor.getLastName(),
          donor.getGender(),
          donor.getBloodType(),
          donor.getEmail(),
          donor.getPhoneNumber(),
          donor.getDateOfBirth(),
          donor.getImage() != null ? donor.getImage().getName() : null);
      dto.setBloodDonor(donorDTO);

      // Count completed appointments (assuming statusId 2 is completed/donated)
      Long completedCount = appointmentRepository.countByBloodDonorIdAndAppointmentStatusId(donor.getId(), 2);
      dto.setDonorCompletedAppointments(completedCount);

      dtoList.add(dto);
    }

    return ResponseEntity.ok(dtoList);
  }

  @GetMapping("/hospital/{hospitalId}/next")
  public ResponseEntity<AppointmentDTO> getNextAppointment(
      @PathVariable Integer hospitalId) {
    java.time.LocalDate today = java.time.LocalDate.now();
    java.time.LocalTime now = java.time.LocalTime.now();

    List<Appointment> nextAppointments = appointmentRepository.findNextAppointments(
        hospitalId, today, now, org.springframework.data.domain.PageRequest.of(0, 1));

    if (nextAppointments.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    Appointment appointment = nextAppointments.get(0);

    AppointmentDTO dto = new AppointmentDTO();
    dto.setId(appointment.getId());
    dto.setAppointmentStatus(appointment.getAppointmentStatus());
    dto.setCampaignId(appointment.getCampaign().getId());
    dto.setBloodDonorId(appointment.getBloodDonor().getId());
    dto.setHospitalComment(appointment.getHospitalComment());
    dto.setDateAppointment(appointment.getDateAppointment());
    dto.setHourAppointment(appointment.getHourAppointment());

    // Fill donor details
    if (appointment.getBloodDonor() != null) {
      com.xiojuandawt.blood4life.entities.BloodDonor donor = appointment.getBloodDonor();
      com.xiojuandawt.blood4life.dto.BloodDonorDTO donorDTO = new com.xiojuandawt.blood4life.dto.BloodDonorDTO(
          donor.getId(),
          donor.getDni(),
          donor.getFirstName(),
          donor.getLastName(),
          donor.getGender(),
          donor.getBloodType(),
          donor.getEmail(),
          donor.getPhoneNumber(),
          donor.getDateOfBirth(),
          donor.getImage() != null ? donor.getImage().getName() : null);
      dto.setBloodDonor(donorDTO);

      Long completedCount = appointmentRepository.countByBloodDonorIdAndAppointmentStatusId(donor.getId(), 2);
      dto.setDonorCompletedAppointments(completedCount);
    }

    return ResponseEntity.ok(dto);
  }
}