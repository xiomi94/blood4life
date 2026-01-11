package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.dto.BloodDonorDTO;
import com.xiojuandawt.blood4life.dto.HospitalDTO;
import com.xiojuandawt.blood4life.dto.AppointmentDTO;
import com.xiojuandawt.blood4life.dto.CampaignDTO;
import com.xiojuandawt.blood4life.entities.*;
import com.xiojuandawt.blood4life.repositories.*;
import com.xiojuandawt.blood4life.services.BloodDonorService;
import com.xiojuandawt.blood4life.services.HospitalService;
import com.xiojuandawt.blood4life.services.CampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalTime;
import java.util.ArrayList;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

  @Autowired
  private BloodDonorService bloodDonorService;

  @Autowired
  private HospitalService hospitalService;

  @Autowired
  private CampaignService campaignService;

  @Autowired
  private AppointmentRepository appointmentRepository;

  @Autowired
  private AppointmentStatusRepository appointmentStatusRepository;

  @Autowired
  private CampaignRepository campaignRepository;

  @Autowired
  private BloodDonorRepository bloodDonorRepository;

  @Autowired
  private AdminRepository adminRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private SimpMessagingTemplate messagingTemplate;

  @GetMapping("/me")
  public ResponseEntity<com.xiojuandawt.blood4life.dto.AdminDTO> obtainMe(
      org.springframework.security.core.Authentication authentication) {
    com.xiojuandawt.blood4life.entities.Admin me = (com.xiojuandawt.blood4life.entities.Admin) authentication
        .getPrincipal();

    com.xiojuandawt.blood4life.dto.AdminDTO meDTO = new com.xiojuandawt.blood4life.dto.AdminDTO();
    meDTO.setId(me.getId());
    meDTO.setEmail(me.getEmail());
    // Add other fields if AdminDTO has them

    return ResponseEntity.ok(meDTO);
  }

  @PostMapping("/change-password")
  public ResponseEntity<?> changePassword(
      @RequestParam("currentPassword") String currentPassword,
      @RequestParam("newPassword") String newPassword,
      org.springframework.security.core.Authentication authentication) {

    Admin admin = (Admin) authentication.getPrincipal();

    if (!passwordEncoder.matches(currentPassword, admin.getPassword())) {
      java.util.Map<String, String> response = new java.util.HashMap<>();
      response.put("error", "ContraseÃ±a actual incorrecta");
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    admin.setPassword(passwordEncoder.encode(newPassword));
    adminRepository.save(admin);

    java.util.Map<String, String> response = new java.util.HashMap<>();
    response.put("message", "ContraseÃ±a actualizada correctamente");
    return ResponseEntity.ok(response);
  }

  @PutMapping("/me")
  public ResponseEntity<?> updateMe(
      @RequestParam("email") String email,
      org.springframework.security.core.Authentication authentication) {

    Admin admin = (Admin) authentication.getPrincipal();
    admin.setEmail(email);
    adminRepository.save(admin);

    com.xiojuandawt.blood4life.dto.AdminDTO meDTO = new com.xiojuandawt.blood4life.dto.AdminDTO();
    meDTO.setId(admin.getId());
    meDTO.setEmail(admin.getEmail());

    return ResponseEntity.ok(meDTO);
  }

  @GetMapping("/blood-donors")
  public ResponseEntity<List<BloodDonorDTO>> getAllBloodDonors() {
    return ResponseEntity.ok(bloodDonorService.findAll());
  }

  @PutMapping("/blood-donors/{id}")
  public ResponseEntity<BloodDonorDTO> updateBloodDonor(@PathVariable Integer id,
      @RequestBody BloodDonor bloodDonorDetails) {
    // The service update method expects the entity and the id
    try {
      BloodDonorDTO updatedDonor = bloodDonorService.update(bloodDonorDetails, id);
      messagingTemplate.convertAndSend("/topic/blood-donors", updatedDonor);
      return ResponseEntity.ok(updatedDonor);
    } catch (Exception e) {
      return ResponseEntity.notFound().build();
    }
  }

  @DeleteMapping("/blood-donors/{id}")
  public ResponseEntity<Void> deleteBloodDonor(@PathVariable Integer id) {
    try {
      bloodDonorService.delete(id);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      return ResponseEntity.notFound().build();
    }
  }

  @GetMapping("/hospitals")
  public ResponseEntity<List<HospitalDTO>> getAllHospitals() {
    return ResponseEntity.ok(hospitalService.findAll());
  }

  @PutMapping("/hospitals/{id}")
  public ResponseEntity<HospitalDTO> updateHospital(@PathVariable Integer id, @RequestBody Hospital hospitalDetails) {
    // The service update method expects the entity. We should probably set the ID
    // on the entity.
    hospitalDetails.setId(id);
    try {
      HospitalDTO updatedHospital = hospitalService.update(hospitalDetails);
      messagingTemplate.convertAndSend("/topic/hospitals", updatedHospital);
      return ResponseEntity.ok(updatedHospital);
    } catch (Exception e) {
      return ResponseEntity.notFound().build();
    }
  }

  @DeleteMapping("/hospitals/{id}")
  public ResponseEntity<Void> deleteHospital(@PathVariable Integer id) {
    try {
      hospitalService.delete(id);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      return ResponseEntity.notFound().build();
    }
  }

  // --- Appointments (Enrollments) ---

  @GetMapping("/appointments")
  public ResponseEntity<List<AppointmentDTO>> getAllAppointments() {
    List<Appointment> appointments = appointmentRepository.findAll();
    List<AppointmentDTO> dtoList = new ArrayList<>();

    for (Appointment app : appointments) {
      dtoList.add(convertAppointmentToDTO(app));
    }
    return ResponseEntity.ok(dtoList);
  }

  @PostMapping("/appointments")
  public ResponseEntity<AppointmentDTO> createAppointment(@RequestBody AppointmentDTO dto) {
    Appointment app = new Appointment();
    updateAppointmentFromDTO(app, dto);
    Appointment saved = appointmentRepository.save(app);
    AppointmentDTO result = convertAppointmentToDTO(saved);
    messagingTemplate.convertAndSend("/topic/appointments", result);
    return ResponseEntity.ok(result);
  }

  @PutMapping("/appointments/{id}")
  public ResponseEntity<AppointmentDTO> updateAppointment(@PathVariable Integer id, @RequestBody AppointmentDTO dto) {
    return appointmentRepository.findById(id)
        .map(app -> {
          updateAppointmentFromDTO(app, dto);
          Appointment updated = appointmentRepository.save(app);
          AppointmentDTO result = convertAppointmentToDTO(updated);
          messagingTemplate.convertAndSend("/topic/appointments", result);
          return ResponseEntity.ok(result);
        })
        .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/appointments/{id}")
  public ResponseEntity<Void> deleteAppointment(@PathVariable Integer id) {
    if (appointmentRepository.existsById(id)) {
      appointmentRepository.deleteById(id);
      // Opcional: Notificar eliminaciÃ³n (requerirÃ­a un formato de mensaje que el
      // front entienda para borrar)
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/appointment-statuses")
  public ResponseEntity<List<AppointmentStatus>> getAllAppointmentStatuses() {
    return ResponseEntity.ok(appointmentStatusRepository.findAll());
  }

  private AppointmentDTO convertAppointmentToDTO(Appointment app) {
    AppointmentDTO dto = new AppointmentDTO();
    dto.setId(app.getId());
    dto.setAppointmentStatus(app.getAppointmentStatus());
    dto.setCampaignId(app.getCampaign().getId());
    dto.setCampaignName(app.getCampaign().getName());
    dto.setBloodDonorId(app.getBloodDonor().getId());
    dto.setHospitalComment(app.getHospitalComment());
    dto.setDateAppointment(app.getDateAppointment());
    dto.setHourAppointment(app.getHourAppointment());

    // Basic donor info for display
    BloodDonor donor = app.getBloodDonor();
    BloodDonorDTO donorDTO = new BloodDonorDTO();
    donorDTO.setId(donor.getId());
    donorDTO.setFirstName(donor.getFirstName());
    donorDTO.setLastName(donor.getLastName());
    donorDTO.setEmail(donor.getEmail());
    dto.setBloodDonor(donorDTO);

    return dto;
  }

  private void updateAppointmentFromDTO(Appointment app, AppointmentDTO dto) {
    if (dto.getAppointmentStatus() != null) {
      app.setAppointmentStatus(appointmentStatusRepository.findById(dto.getAppointmentStatus().getId())
          .orElseThrow(() -> new RuntimeException("Status not found")));
    }
    if (dto.getCampaignId() != null) {
      app.setCampaign(campaignRepository.findById(dto.getCampaignId())
          .orElseThrow(() -> new RuntimeException("Campaign not found")));
    }
    if (dto.getBloodDonorId() != null) {
      app.setBloodDonor(bloodDonorRepository.findById(dto.getBloodDonorId())
          .orElseThrow(() -> new RuntimeException("Donor not found")));
    }
    app.setHospitalComment(dto.getHospitalComment());
    app.setDateAppointment(dto.getDateAppointment());
    if (dto.getHourAppointment() != null) {
      app.setHourAppointment(dto.getHourAppointment());
    } else if (app.getHourAppointment() == null) {
      app.setHourAppointment(LocalTime.of(9, 0));
    }
  }

  // --- Campaigns ---

  @GetMapping("/campaigns")
  public ResponseEntity<List<CampaignDTO>> getAllCampaigns() {
    return ResponseEntity.ok(campaignService.findAll());
  }

  @PutMapping("/campaigns/{id}")
  public ResponseEntity<CampaignDTO> updateCampaign(@PathVariable Integer id, @RequestBody Campaign campaignDetails) {
    try {
      // For simplicity using service update, but we need to pass bloodTypes if they
      // change.
      // Or just a direct repo save if it's basic fields.
      // Re-using campaignService.updateCampaign which expects bloodTypes list.
      // Let's assume for now admin edits basic fields.
      CampaignDTO updated = campaignService.updateCampaign(id, campaignDetails, null);
      messagingTemplate.convertAndSend("/topic/campaigns", updated);
      return ResponseEntity.ok(updated);
    } catch (Exception e) {
      return ResponseEntity.notFound().build();
    }
  }

  @DeleteMapping("/campaigns/{id}")
  public ResponseEntity<Void> deleteCampaign(@PathVariable Integer id) {
    try {
      campaignService.deleteCampaign(id);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      return ResponseEntity.notFound().build();
    }
  }
}
