package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.dto.HospitalDTO;
import com.xiojuandawt.blood4life.entities.Hospital;
import com.xiojuandawt.blood4life.exception.ResourceNotFoundException;
import com.xiojuandawt.blood4life.services.HospitalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hospital")
public class HospitalController {

  @Autowired
  private HospitalService hospitalService;

  @Autowired
  private com.xiojuandawt.blood4life.services.ImageService imageService;

  @Autowired
  private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

  // ----------------- GET ALL -----------------
  @GetMapping("/me")
  public ResponseEntity<?> obtainMe(org.springframework.security.core.Authentication authentication) {
    // Check if authentication is null (unauthenticated request)
    if (authentication == null || authentication.getPrincipal() == null) {
      java.util.Map<String, String> error = new java.util.HashMap<>();
      error.put("error", "No tienes una sesión iniciada");
      return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).body(error);
    }

    // Check if the authenticated user is actually a Hospital
    if (!(authentication.getPrincipal() instanceof Hospital)) {
      java.util.Map<String, String> error = new java.util.HashMap<>();
      error.put("error",
          "No puedes identificarte como hospital porque tu sesión actual es de un tipo de usuario diferente. Por favor, cierra sesión primero.");
      return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body(error);
    }

    Hospital authenticatedHospital = (Hospital) authentication.getPrincipal();

    // Fetch fresh data from database instead of using cached authentication object
    Hospital me = hospitalService.findById(authenticatedHospital.getId())
        .orElseThrow(
            () -> new ResourceNotFoundException("Hospital not found with id " + authenticatedHospital.getId()));

    String imageName = me.getImage() != null ? me.getImage().getName() : null;

    // DEBUG: Log what we're returning
    System.out.println("===== DEBUG /me endpoint =====");
    System.out.println("Hospital ID: " + me.getId());
    System.out.println("Hospital Name: " + me.getName());
    System.out.println("Hospital Phone: " + me.getPhoneNumber());
    System.out.println("Has Image: " + (me.getImage() != null));
    System.out.println("Image Name: " + imageName);
    System.out.println("==============================");

    HospitalDTO meDTO = new HospitalDTO();
    meDTO.setId(me.getId());
    meDTO.setCif(me.getCif());
    meDTO.setName(me.getName());
    meDTO.setAddress(me.getAddress());
    meDTO.setPostalCode(me.getPostalCode());
    meDTO.setEmail(me.getEmail());
    meDTO.setPhoneNumber(me.getPhoneNumber());
    meDTO.setImageName(imageName);

    return ResponseEntity.ok(meDTO);
  }

  @GetMapping
  public ResponseEntity<List<HospitalDTO>> getAllHospitals() {
    List<HospitalDTO> hospitalDTOList = hospitalService.findAll();
    return ResponseEntity.ok(hospitalDTOList);
  }

  // ----------------- ADD NEW -----------------
  @PostMapping
  public ResponseEntity<HospitalDTO> addHospital(@Valid @RequestBody Hospital newHospital) {
    HospitalDTO hospitalDTO = hospitalService.createNew(newHospital);
    return ResponseEntity.status(HttpStatus.CREATED).body(hospitalDTO);
  }

  // ----------------- UPDATE -----------------
  @PutMapping
  public ResponseEntity<?> updateHospital(
      @RequestParam("id") Integer id,
      @RequestParam("cif") String cif,
      @RequestParam("name") String name,
      @RequestParam("address") String address,
      @RequestParam("postalCode") String postalCode,
      @RequestParam("email") String email,
      @RequestParam("phoneNumber") String phoneNumber,
      @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile imageFile) {
    try {
      System.out.println("===== DEBUG updateHospital =====");
      System.out.println("ID: " + id);
      System.out.println("CIF: " + cif);
      System.out.println("Name: " + name);
      System.out.println("Address: " + address);
      System.out.println("Email: " + email);
      System.out.println("PhoneNumber: " + phoneNumber);
      System.out.println("Has Image: " + (imageFile != null && !imageFile.isEmpty()));
      System.out.println("==============================");

      Hospital hospitalInDatabase = hospitalService.findById(id)
          .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id " + id));

      // Update fields
      hospitalInDatabase.setCif(cif);
      hospitalInDatabase.setName(name);
      hospitalInDatabase.setAddress(address);
      hospitalInDatabase.setPostalCode(postalCode);
      hospitalInDatabase.setEmail(email);
      hospitalInDatabase.setPhoneNumber(phoneNumber);

      // Handle image update if provided
      if (imageFile != null && !imageFile.isEmpty()) {
        String extension = java.util.Optional.ofNullable(imageFile.getOriginalFilename())
            .map(f -> f.contains(".") ? f.substring(f.lastIndexOf(".")) : "")
            .orElse("");
        String imageFileName = java.util.UUID.randomUUID().toString() + extension;
        com.xiojuandawt.blood4life.entities.Image imageEntity = imageService.saveImage(imageFile, imageFileName);
        hospitalInDatabase.setImage(imageEntity);
      }

      HospitalDTO hospitalDTO = hospitalService.update(hospitalInDatabase);
      return ResponseEntity.ok(hospitalDTO);

    } catch (ResourceNotFoundException e) {
      Map<String, String> body = new HashMap<>();
      body.put("error", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    } catch (Exception e) {
      Map<String, String> body = new HashMap<>();
      body.put("error", "Error al actualizar: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
  }

  // ----------------- CHANGE PASSWORD -----------------
  @PostMapping("/change-password")
  public ResponseEntity<?> changePassword(
      @RequestParam("currentPassword") String currentPassword,
      @RequestParam("newPassword") String newPassword,
      org.springframework.security.core.Authentication authentication) {
    try {
      Hospital hospital = (Hospital) authentication.getPrincipal();

      // Verify current password
      if (!passwordEncoder.matches(currentPassword, hospital.getPassword())) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "La contraseña actual es incorrecta");
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(body);
      }

      // Validate new password
      if (newPassword == null || newPassword.trim().isEmpty()) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "La contraseña es obligatoria");
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(body);
      }
      if (newPassword.length() < 8) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "La contraseña debe tener al menos 8 caracteres");
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(body);
      }
      if (newPassword.length() > 32) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "La contraseña no puede exceder 32 caracteres");
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(body);
      }
      if (!newPassword.matches(".*[a-z].*")) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "La contraseña debe contener al menos una minúscula");
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(body);
      }
      if (!newPassword.matches(".*[A-Z].*")) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "La contraseña debe contener al menos una mayúscula");
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(body);
      }
      if (!newPassword.matches(".*\\d.*")) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "La contraseña debe contener al menos un número");
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(body);
      }
      if (newPassword.contains(" ")) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "La contraseña no puede contener espacios");
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(body);
      }
      if (newPassword.matches(".*(.)\\1{3,}.*")) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "Demasiados caracteres repetidos");
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(body);
      }

      // Update password
      Hospital hospitalInDb = hospitalService.findById(hospital.getId())
          .orElseThrow(() -> new ResourceNotFoundException("Hospital not found"));
      hospitalInDb.setPassword(passwordEncoder.encode(newPassword));
      hospitalService.update(hospitalInDb);

      Map<String, String> body = new HashMap<>();
      body.put("message", "Contraseña actualizada correctamente");
      return ResponseEntity
          .status(HttpStatus.OK)
          .body(body);
    } catch (Exception e) {
      Map<String, String> body = new HashMap<>();
      body.put("error", "Error al cambiar la contraseña: " + e.getMessage());
      return ResponseEntity
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(body);
    }
  }

  @DeleteMapping("/delete-account")
  public ResponseEntity<Map<String, String>> deleteAccount(
      org.springframework.security.core.Authentication authentication) {
    try {
      Hospital hospital = (Hospital) authentication.getPrincipal();

      // Simple DELETE - MySQL trigger will:
      // 1. Set deleted_at in hospital_log BEFORE delete
      // 2. Keep all historical data in _log table
      // 3. Remove from hospital (email becomes available for reuse)
      hospitalService.delete(hospital.getId());

      Map<String, String> response = new HashMap<>();
      response.put("status", "OK");
      response.put("message", "Cuenta eliminada exitosamente");
      return ResponseEntity
          .status(HttpStatus.OK)
          .body(response);

    } catch (Exception e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("error", "Error al eliminar la cuenta: " + e.getMessage());
      return ResponseEntity
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(errorResponse);
    }
  }

  // ----------------- DELETE -----------------
  @DeleteMapping("/{id}")
  public ResponseEntity<Map<String, String>> deleteHospital(@PathVariable("id") Integer id) {
    try {
      hospitalService.delete(id);
      Map<String, String> body = new HashMap<>();
      body.put("status", "OK");
      return ResponseEntity.ok(body);
    } catch (ResourceNotFoundException e) {
      Map<String, String> body = new HashMap<>();
      body.put("error", "No se ha encontrado el hospital con id " + id);
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }
  }
}
