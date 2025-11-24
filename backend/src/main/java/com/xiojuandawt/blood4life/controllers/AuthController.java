package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.entities.BloodDonor;
import com.xiojuandawt.blood4life.entities.Hospital;
import com.xiojuandawt.blood4life.services.BloodDonorService;
import com.xiojuandawt.blood4life.services.HospitalService;
import com.xiojuandawt.blood4life.services.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  private BloodDonorService bloodDonorService;

  @Autowired
  private HospitalService hospitalService;

  @Autowired
  private JwtService jwtService;

  @Autowired
  private PasswordEncoder passwordEncoder;


  @PostMapping("/bloodDonor/register")
  public ResponseEntity<Map<String, String>> registerBloodDonor(@RequestBody BloodDonor bloodDonor) {
    // Comprobamos que no exista otro usuario con el mismo email
    Optional<BloodDonor> existing = bloodDonorService.findByEmail(bloodDonor.getEmail());
    if (existing.isPresent()) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(Map.of("error", "Email already registered"));
    }

    // Encriptar contraseña
    bloodDonor.setPassword(passwordEncoder.encode(bloodDonor.getPassword()));
    bloodDonorService.createNew(bloodDonor);

    return ResponseEntity.status(HttpStatus.CREATED)
      .body(Map.of("status", "OK"));
  }

  // 🔹 Login con Authorization: Basic base64(email:password)
  @PostMapping("/bloodDonor/login")
  public ResponseEntity<?> loginBloodDonor(@RequestHeader(value = "Authorization", required = true) String authHeader) {
    try {

      String[] credentials = extractCredentials(authHeader);

      String email = credentials[0];
      String password = credentials[1];


      Optional<BloodDonor> bloodDonorOpt = bloodDonorService.findByEmail(email);

      if (bloodDonorOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(Map.of("error", "Invalid credentials"));
      }

      BloodDonor bloodDonor = bloodDonorOpt.get();

      // Comparar contraseñas
      if (!passwordEncoder.matches(password, bloodDonor.getPassword())) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(Map.of("error", "Invalid credentials"));
      }

      // Generar token JWT
      String token = jwtService.generateToken(bloodDonor.getId(), "bloodDonor");

      Map<String, String> responseBody = new HashMap<>();
      responseBody.put("token", token);

      responseBody.put("status", "OK");
      return ResponseEntity.ok(responseBody);

    } catch (IllegalArgumentException e) {

      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(Map.of("error", e.getMessage()));
    }
  }

  // 🔹 Extrae usuario y contraseña del header Basic Auth
  private String[] extractCredentials(String authHeader) {
    if (authHeader == null || !authHeader.startsWith("Basic ")) {
      throw new IllegalArgumentException("Missing or invalid Authorization header");
    }

    String base64Credentials = authHeader.substring("Basic ".length());
    byte[] decodedBytes = Base64.getDecoder().decode(base64Credentials);
    String decodedString = new String(decodedBytes);

    if (!decodedString.contains(":")) {
      throw new IllegalArgumentException("Invalid Basic Auth format. Expected 'email:password'");
    }

    return decodedString.split(":", 2);
  }

  // 🔹 Registro de nuevo donante
  @PostMapping("/hospital/register")
  public ResponseEntity<Map<String, String>> registerHospital(@RequestBody Hospital hospital) {
    // Comprobamos que no exista otro usuario con el mismo email
    Optional<Hospital> existing = hospitalService.findHospitalByEmail(hospital.getEmail());
    if (existing.isPresent()) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(Map.of("error", "The email is already registered"));
    }

    // Encriptar contraseña
    hospital.setPassword(passwordEncoder.encode(hospital.getPassword()));
    hospitalService.createNew(hospital);

    return ResponseEntity.status(HttpStatus.CREATED)
      .body(Map.of("status", "OK"));
  }

  // 🔹 Login con Authorization: Basic base64(email:password)
  @PostMapping("/hospital/login")
  public ResponseEntity<?> loginHospital(@RequestHeader(value = "Authorization", required = true) String authHeader) {
    try {

      String[] credentials = extractCredentials(authHeader);

      String email = credentials[0];
      String password = credentials[1];


      Optional<Hospital> hospitalOpt = hospitalService.findHospitalByEmail(email);

      if (hospitalOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(Map.of("error", "Invalid credentials"));
      }

      Hospital hospital = hospitalOpt.get();


      // Comparar contraseñas
      if (!passwordEncoder.matches(password, hospital.getPassword())) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(Map.of("error", "Invalid credentials"));
      }
      // Generar token JWT
      String token = jwtService.generateToken(hospital.getId(), "hospital");

      Map<String, String> responseBody = new HashMap<>();
      responseBody.put("token", token);

      responseBody.put("status", "OK");
      return ResponseEntity.ok(responseBody);

    } catch (IllegalArgumentException e) {

      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(Map.of("error", e.getMessage()));
    }
  }
}