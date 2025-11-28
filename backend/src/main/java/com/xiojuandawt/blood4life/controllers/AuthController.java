package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.dto.BloodDonorDTO;
import com.xiojuandawt.blood4life.entities.BloodDonor;
import com.xiojuandawt.blood4life.entities.BloodType;
import com.xiojuandawt.blood4life.entities.Hospital;
import com.xiojuandawt.blood4life.entities.Image;
import com.xiojuandawt.blood4life.services.BloodDonorService;
import com.xiojuandawt.blood4life.services.HospitalService;
import com.xiojuandawt.blood4life.services.ImageService;
import com.xiojuandawt.blood4life.services.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

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

  @Autowired
  private ImageService imageService;

  // @PostMapping("/bloodDonor/register")
  // public ResponseEntity<Map<String, String>> registerBloodDonor(@RequestBody
  // BloodDonor bloodDonor) {
  // // Comprobamos que no exista otro usuario con el mismo email
  // Optional<BloodDonor> emailExisting =
  // bloodDonorService.findByEmail(bloodDonor.getEmail());
  // if (emailExisting.isPresent()) {
  // return ResponseEntity.status(HttpStatus.CONFLICT)
  // .body(Map.of("error", "Email already registered"));
  // }
  //
  // // Encriptar contraseña
  // bloodDonor.setPassword(passwordEncoder.encode(bloodDonor.getPassword()));
  // bloodDonorService.createNew(bloodDonor);
  //
  // return ResponseEntity.status(HttpStatus.CREATED)
  // .body(Map.of("status", "OK"));
  // }

  @PostMapping("/bloodDonor/register")
  public ResponseEntity<?> registerBloodDonor(
      @RequestParam("dni") String dni,
      @RequestParam("firstName") String firstName,
      @RequestParam("lastName") String lastName,
      @RequestParam("gender") String gender,
      @RequestParam("bloodTypeId") Integer bloodTypeId,
      @RequestParam("email") String email,
      @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
      @RequestParam(value = "dateOfBirth", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateOfBirth,
      @RequestParam("password") String password,
      @RequestParam(value = "image", required = false) MultipartFile imageFile) {

    try {
      Optional<BloodDonor> existing = bloodDonorService.findByEmail(email);
      if (existing.isPresent()) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(Map.of("error", "Email already registered"));
      }

      // Guardar imagen
      Image imageEntity = null;
      if (imageFile != null && !imageFile.isEmpty()) {
        String originalFilename = imageFile.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
          extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String imageFileName = UUID.randomUUID().toString() + extension;
        imageEntity = imageService.saveImage(imageFile, imageFileName);
      }

      BloodType bloodType = bloodDonorService.findBloodTypeById(bloodTypeId)
          .orElseThrow(() -> new IllegalArgumentException("Invalid blood type ID"));

      BloodDonor bloodDonor = new BloodDonor();
      bloodDonor.setDni(dni);
      bloodDonor.setFirstName(firstName);
      bloodDonor.setLastName(lastName);
      bloodDonor.setGender(gender);
      bloodDonor.setBloodType(bloodType);
      bloodDonor.setEmail(email);
      bloodDonor.setPhoneNumber(phoneNumber);
      bloodDonor.setDateOfBirth(dateOfBirth);
      bloodDonor.setPassword(passwordEncoder.encode(password));
      bloodDonor.setImage(imageEntity);

      bloodDonorService.createNew(bloodDonor);

      BloodDonorDTO responseDTO = new BloodDonorDTO();
      responseDTO.setId(bloodDonor.getId());
      responseDTO.setDni(bloodDonor.getDni());
      responseDTO.setFirstName(bloodDonor.getFirstName());
      responseDTO.setLastName(bloodDonor.getLastName());
      responseDTO.setGender(bloodDonor.getGender());
      responseDTO.setBloodType(bloodType);
      responseDTO.setEmail(bloodDonor.getEmail());
      responseDTO.setPhoneNumber(bloodDonor.getPhoneNumber());
      responseDTO.setDateOfBirth(bloodDonor.getDateOfBirth());
      responseDTO.setImageName(imageEntity != null ? imageEntity.getName() : null);

      return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of("error", e.getMessage()));
    }
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

      // Crear Cookie HttpOnly
      ResponseCookie jwtCookie = ResponseCookie.from("jwt", token)
          .httpOnly(true)
          .secure(false) // Cambiar a true en producción con HTTPS
          .path("/")
          .maxAge(24 * 60 * 60) // 1 día
          .sameSite("Strict")
          .build();

      return ResponseEntity.ok()
          .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
          .body(Map.of("status", "OK", "message", "Login successful"));

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

  @PostMapping("/bloodDonor/register")
  public ResponseEntity<?> registerBloodDonor(
      @RequestParam("dni") String dni,
      @RequestParam("firstName") String firstName,
      @RequestParam("lastName") String lastName,
      @RequestParam("gender") String gender,
      @RequestParam("bloodTypeId") Integer bloodTypeId,
      @RequestParam("email") String email,
      @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
      @RequestParam(value = "dateOfBirth", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateOfBirth,
      @RequestParam("password") String password,
      @RequestParam(value = "image", required = false) MultipartFile imageFile) {

    try {
      Optional<BloodDonor> existing = bloodDonorService.findByEmail(email);
      if (existing.isPresent()) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(Map.of("error", "Email already registered"));
      }

      // Guardar imagen
      Image imageEntity = null;
      if (imageFile != null && !imageFile.isEmpty()) {
        String originalFilename = imageFile.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
          extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String imageFileName = UUID.randomUUID().toString() + extension;
        imageEntity = imageService.saveImage(imageFile, imageFileName);
      }

      // Crear BloodDonor
      Hospital hospital = hospitalService.findHospitalById(hospitalId)
          .orElseThrow(() -> new IllegalArgumentException("Invalid hospital ID"));

      Hospital hospital = new Hospital();
      hospital.setCif(cif);
      hospital.setName(name);
      hospital.setAddress(address);
      hospital.setEmail(email);
      hospital.setPhoneNumber(phoneNumber);
      hospital.setPassword(passwordEncoder.encode(password));
      hospital.setImage(imageEntity);

      hospitalService.createNew(hospital);

      HospitalDTO responseDTO = new HospitalDTO();
      responseDTO.setId(hospital.getId());
      responseDTO.setCif(hospital.getCif());
      responseDTO.setName(hospital.getName());
      responseDTO.setAddress(hospital.getAddress());
      responseDTO.setEmail(hospital.getEmail());
      responseDTO.setPhoneNumber(hospital.getPhoneNumber());
      responseDTO.setImageName(imageEntity != null ? imageEntity.getName() : null);

      return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of("error", e.getMessage("Error, hospital not created")));
    }
  }

  @PostMapping("/hospital/login")
  public ResponseEntity<?> loginHospital(@RequestHeader(value = "Authorization", required = true) String authHeader) {
    try {

      String[] credentials = extractCredentials(authHeader);

      String email = credentials[0];
      String password = credentials[1];

      Optional<Hospital> hospitalOpt = hospitalService.findByEmail(email);

      if (hospitalOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("error", "Invalid credentials"));
      }

      Hospital hospital = hospitalOpt.get();

      if (!passwordEncoder.matches(password, hospital.getPassword())) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("error", "Invalid credentials"));
      }

      String token = jwtService.generateToken(hospital.getId(), "hospital");

      ResponseCookie jwtCookie = ResponseCookie.from("jwt", token)
          .httpOnly(true)
          .secure(false)
          .path("/")
          .maxAge(24 * 60 * 60)
          .sameSite("Strict")
          .build();

      return ResponseEntity.ok()
          .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
          .body(Map.of("status", "OK", "message", "Login successful"));

    } catch (IllegalArgumentException e) {

      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(Map.of("error", e.getMessage()));
    }
  }

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

  @PostMapping("/hospital/register")
  public ResponseEntity<Map<String, String>> registerHospital(@RequestBody Hospital hospital) {
    Optional<Hospital> existing = hospitalService.findHospitalByEmail(hospital.getEmail());
    if (existing.isPresent()) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body(Map.of("error", "The email is already registered"));
    }

    hospital.setPassword(passwordEncoder.encode(hospital.getPassword()));
    hospitalService.createNew(hospital);

    return ResponseEntity.status(HttpStatus.CREATED)
        .body(Map.of("status", "OK"));
  }
}