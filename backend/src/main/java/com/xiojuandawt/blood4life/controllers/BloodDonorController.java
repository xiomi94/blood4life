package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.dto.BloodDonorDTO;
import com.xiojuandawt.blood4life.entities.BloodDonor;
import com.xiojuandawt.blood4life.entities.BloodType;
import com.xiojuandawt.blood4life.exception.ResourceNotFoundException;
import com.xiojuandawt.blood4life.services.BloodDonorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bloodDonor")
public class BloodDonorController {

  @Autowired
  private BloodDonorService bloodDonorService;

  @Autowired
  private com.xiojuandawt.blood4life.services.ImageService imageService;

  @Autowired
  private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

  @GetMapping("/me")
  public ResponseEntity<?> obtainMe(Authentication authentication) {
    // Check if authentication is null (unauthenticated request)
    if (authentication == null || authentication.getPrincipal() == null) {
      Map<String, String> error = new HashMap<>();
      error.put("error", "No tienes una sesión iniciada");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    // Check if the authenticated user is actually a BloodDonor
    if (!(authentication.getPrincipal() instanceof BloodDonor)) {
      Map<String, String> error = new HashMap<>();
      error.put("error",
          "No puedes identificarte como donante porque tu sesión actual es de un tipo de usuario diferente. Por favor, cierra sesión primero.");
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    BloodDonor me = (BloodDonor) authentication.getPrincipal();
    String imageName = me.getImage() != null ? me.getImage().getName() : null;
    BloodDonorDTO meDTO = new BloodDonorDTO(
        me.getId(),
        me.getDni(),
        me.getFirstName(),
        me.getLastName(),
        me.getGender(),
        me.getBloodType(),
        me.getEmail(),
        me.getPhoneNumber(),
        me.getDateOfBirth(),
        imageName

    );
    return ResponseEntity
        .status(HttpStatus.OK).body(meDTO);
  }

  @GetMapping
  public ResponseEntity<List<BloodDonorDTO>> bloodDonorList() {
    List<BloodDonorDTO> bloodDonorList = this.bloodDonorService.findAll();
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(bloodDonorList);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateBloodDonor(
      @PathVariable Integer id,
      @RequestParam("dni") String dni,
      @RequestParam("firstName") String firstName,
      @RequestParam("lastName") String lastName,
      @RequestParam("gender") String gender,
      @RequestParam("bloodTypeId") Integer bloodTypeId,
      @RequestParam("email") String email,
      @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
      @RequestParam(value = "dateOfBirth", required = false) @org.springframework.format.annotation.DateTimeFormat(pattern = "yyyy-MM-dd") java.util.Date dateOfBirth,
      @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile imageFile) {
    try {
      BloodDonor bloodDonorInDatabase = this.bloodDonorService.findByIdWithRole(id)
          .orElseThrow(() -> new ResourceNotFoundException());

      // Preserve existing data
      BloodType bloodType = bloodDonorService.findBloodTypeById(bloodTypeId)
          .orElseThrow(() -> new IllegalArgumentException("Invalid blood type ID"));

      // Update fields
      bloodDonorInDatabase.setDni(dni);
      bloodDonorInDatabase.setFirstName(firstName);
      bloodDonorInDatabase.setLastName(lastName);
      bloodDonorInDatabase.setGender(gender);
      bloodDonorInDatabase.setBloodType(bloodType);
      bloodDonorInDatabase.setEmail(email);
      bloodDonorInDatabase.setPhoneNumber(phoneNumber);
      bloodDonorInDatabase.setDateOfBirth(dateOfBirth);

      // Handle image update if provided
      if (imageFile != null && !imageFile.isEmpty()) {
        String extension = java.util.Optional.ofNullable(imageFile.getOriginalFilename())
            .map(f -> f.contains(".") ? f.substring(f.lastIndexOf(".")) : "")
            .orElse("");
        String imageFileName = java.util.UUID.randomUUID().toString() + extension;
        com.xiojuandawt.blood4life.entities.Image imageEntity = imageService.saveImage(imageFile, imageFileName);
        bloodDonorInDatabase.setImage(imageEntity);
      }

      // Save updated donor
      BloodDonorDTO updatedDTO = this.bloodDonorService.update(bloodDonorInDatabase, id);

      return ResponseEntity
          .status(HttpStatus.OK)
          .body(updatedDTO);
    } catch (ResourceNotFoundException e) {
      Map<String, String> body = new HashMap<>();
      body.put("error", "El donante con id " + id + " no existe");
      return ResponseEntity
          .status(HttpStatus.NOT_FOUND)
          .body(body);
    } catch (Exception e) {
      Map<String, String> body = new HashMap<>();
      body.put("error", "Error al actualizar: " + e.getMessage());
      return ResponseEntity
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(body);
    }
  }

  @PostMapping("/change-password")
  public ResponseEntity<?> changePassword(
      @RequestParam("currentPassword") String currentPassword,
      @RequestParam("newPassword") String newPassword,
      org.springframework.security.core.Authentication authentication) {
    try {
      BloodDonor donor = (BloodDonor) authentication.getPrincipal();

      // Verify current password
      if (!passwordEncoder.matches(currentPassword, donor.getPassword())) {
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
      BloodDonor donorInDb = bloodDonorService.findByIdWithRole(donor.getId())
          .orElseThrow(() -> new ResourceNotFoundException());
      donorInDb.setPassword(passwordEncoder.encode(newPassword));
      bloodDonorService.update(donorInDb, donor.getId());

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
  public ResponseEntity<Map<String, String>> deleteAccount(Authentication authentication) {
    try {
      BloodDonor bloodDonor = (BloodDonor) authentication.getPrincipal();

      // Simple DELETE - MySQL trigger handles logging
      bloodDonorService.delete(bloodDonor.getId());

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

  @DeleteMapping("/{id}")
  public ResponseEntity<Map<String, String>> deleteById(
      @PathVariable Integer id) {
    this.bloodDonorService.delete(id);
    Map<String, String> body = new HashMap<>();
    body.put("status", "OK");
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(body);
  }

}
