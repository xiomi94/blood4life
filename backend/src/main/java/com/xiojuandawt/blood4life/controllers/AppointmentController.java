package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.dto.AppointmentDTO;
import com.xiojuandawt.blood4life.entities.Appointment;
import com.xiojuandawt.blood4life.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

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
    @PathVariable Integer id
  ) {

    Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);

    if (optionalAppointment.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    Appointment appointment = optionalAppointment.get();

    AppointmentDTO dto = new AppointmentDTO();

    dto.setId(appointment.getId());
    dto.setAppointmentStatus(appointment.getAppointmentStatus()); // ✔ correcto
    dto.setCampaignId(appointment.getCampaign().getId());
    dto.setBloodDonorId(appointment.getBloodDonor().getId());
    dto.setHospitalComment(appointment.getHospitalComment());
    dto.setDateAppointment(appointment.getDateAppointment());

    return ResponseEntity.ok(dto);
  }

  @PostMapping("/create")
  public ResponseEntity<AppointmentDTO> createAppointment(
    @RequestBody AppointmentDTO dto
  ) {
    Appointment appointment = new Appointment();

    appointment.setAppointmentStatus(
      appointmentStatusRepository.findById(dto.getAppointmentStatus().getId())
        .orElseThrow(() -> new RuntimeException("Estado no encontrado"))
    );

    appointment.setCampaign(
      campaignRepository.findById(dto.getCampaignId())
        .orElseThrow(() -> new RuntimeException("Campaña no encontrada"))
    );

    appointment.setBloodDonor(
      bloodDonorRepository.findById(dto.getBloodDonorId())
        .orElseThrow(() -> new RuntimeException("Donante no encontrado"))
    );

    appointment.setHospitalComment(dto.getHospitalComment());
    appointment.setDateAppointment(dto.getDateAppointment());

    Appointment saved = appointmentRepository.save(appointment);

    // --- Convert entity → DTO ---
    AppointmentDTO result = new AppointmentDTO();
    result.setId(saved.getId());
    result.setAppointmentStatus(saved.getAppointmentStatus());
    result.setCampaignId(saved.getCampaign().getId());
    result.setBloodDonorId(saved.getBloodDonor().getId());
    result.setHospitalComment(saved.getHospitalComment());
    result.setDateAppointment(saved.getDateAppointment());

    return ResponseEntity.ok(result);
  }

  @PutMapping("/update/{id}")
  public ResponseEntity<AppointmentDTO> updateAppointment(
    @PathVariable Integer id,
    @RequestBody AppointmentDTO dto
  ) {

    Optional<Appointment> optional = appointmentRepository.findById(id);

    if (optional.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    Appointment appointment = optional.get();

    // Update fields
    appointment.setAppointmentStatus(
      appointmentStatusRepository.findById(dto.getAppointmentStatus().getId())
        .orElseThrow(() -> new RuntimeException("Estado no encontrado"))
    );

    appointment.setCampaign(
      campaignRepository.findById(dto.getCampaignId())
        .orElseThrow(() -> new RuntimeException("Campaña no encontrada"))
    );

    appointment.setBloodDonor(
      bloodDonorRepository.findById(dto.getBloodDonorId())
        .orElseThrow(() -> new RuntimeException("Donante no encontrado"))
    );

    appointment.setHospitalComment(dto.getHospitalComment());
    appointment.setDateAppointment(dto.getDateAppointment());

    Appointment updated = appointmentRepository.save(appointment);

    // Convert entity → DTO
    AppointmentDTO result = new AppointmentDTO();
    result.setId(updated.getId());
    result.setAppointmentStatus(updated.getAppointmentStatus());
    result.setCampaignId(updated.getCampaign().getId());
    result.setBloodDonorId(updated.getBloodDonor().getId());
    result.setHospitalComment(updated.getHospitalComment());
    result.setDateAppointment(updated.getDateAppointment());

    return ResponseEntity.ok(result);
  }

  @DeleteMapping("delete/{id}")
  public ResponseEntity<Void> deleteAppointment(
    @PathVariable Integer id
  ) {

    if (!appointmentRepository.existsById(id)) {
      return ResponseEntity.notFound().build();
    }

    appointmentRepository.deleteById(id);

    return ResponseEntity.noContent().build();
  }

}