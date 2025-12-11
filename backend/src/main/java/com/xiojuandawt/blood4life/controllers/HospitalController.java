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

  // ----------------- GET ALL -----------------
  @GetMapping("/me")
  public ResponseEntity<?> obtainMe(org.springframework.security.core.Authentication authentication) {
    // Check if authentication is null (unauthenticated request)
    if (authentication == null || authentication.getPrincipal() == null) {
      java.util.Map<String, String> error = new java.util.HashMap<>();
      error.put("error", "Unauthorized - No authentication found");
      return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).body(error);
    }

    Hospital me = (Hospital) authentication.getPrincipal();
    String imageName = me.getImage() != null ? me.getImage().getName() : null;

    // DEBUG: Log what we're returning
    System.out.println("===== DEBUG /me endpoint =====");
    System.out.println("Hospital ID: " + me.getId());
    System.out.println("Hospital Name: " + me.getName());
    System.out.println("Has Image: " + (me.getImage() != null));
    System.out.println("Image Name: " + imageName);
    System.out.println("==============================");

    HospitalDTO meDTO = new HospitalDTO();
    meDTO.setId(me.getId());
    meDTO.setCif(me.getCif());
    meDTO.setName(me.getName());
    meDTO.setAddress(me.getAddress());
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
  @PutMapping(consumes = "multipart/form-data")
  public ResponseEntity<?> updateHospital(
      @RequestParam("name") String name,
      @RequestParam("email") String email,
      @RequestParam("phoneNumber") String phoneNumber,
      @RequestParam("address") String address,
      @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile imageFile,
      @RequestParam(value = "currentPassword", required = false) String currentPassword,
      @RequestParam(value = "newPassword", required = false) String newPassword,
      org.springframework.security.core.Authentication authentication) {

    try {
      // Get authenticated hospital
      if (authentication == null || authentication.getPrincipal() == null) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Unauthorized - No authentication found");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
      }

      Hospital hospital = (Hospital) authentication.getPrincipal();

      // Update basic fields
      hospital.setName(name);
      hospital.setEmail(email);
      hospital.setPhoneNumber(phoneNumber);
      hospital.setAddress(address);

      // Handle image upload if provided
      if (imageFile != null && !imageFile.isEmpty()) {
        try {
          // Get file extension
          String originalFilename = imageFile.getOriginalFilename();
          String extension = originalFilename != null && originalFilename.contains(".")
              ? originalFilename.substring(originalFilename.lastIndexOf("."))
              : ".png";

          // Generate unique filename
          String fileName = java.util.UUID.randomUUID().toString() + extension;

          // Save image using ImageService
          com.xiojuandawt.blood4life.entities.Image imageEntity = hospitalService.getImageService().saveImage(imageFile,
              fileName);
          hospital.setImage(imageEntity);

        } catch (java.io.IOException e) {
          Map<String, String> body = new HashMap<>();
          body.put("error", "Error al guardar la imagen: " + e.getMessage());
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
      }

      // Handle password change if requested
      if (newPassword != null && !newPassword.isEmpty()) {
        if (currentPassword == null || currentPassword.isEmpty()) {
          Map<String, String> body = new HashMap<>();
          body.put("error", "Debe proporcionar la contraseña actual para cambiarla");
          return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
        }

        // Verify current password
        if (!new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder()
            .matches(currentPassword, hospital.getPassword())) {
          Map<String, String> body = new HashMap<>();
          body.put("error", "La contraseña actual es incorrecta");
          return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
        }

        // Encode and set new password
        hospital.setPassword(
            new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder()
                .encode(newPassword));
      }

      HospitalDTO hospitalDTO = hospitalService.update(hospital);

      return ResponseEntity.ok(hospitalDTO);

    } catch (ResourceNotFoundException e) {
      Map<String, String> body = new HashMap<>();
      body.put("error", "No se ha encontrado el hospital");
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    } catch (Exception e) {
      Map<String, String> body = new HashMap<>();
      body.put("error", "Error al actualizar el hospital: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
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
