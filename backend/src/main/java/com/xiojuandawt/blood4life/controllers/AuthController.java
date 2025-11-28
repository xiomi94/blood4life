package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.dto.BloodDonorDTO;
import com.xiojuandawt.blood4life.dto.HospitalDTO;
import com.xiojuandawt.blood4life.entities.BloodDonor;
import com.xiojuandawt.blood4life.entities.BloodType;
import com.xiojuandawt.blood4life.entities.Hospital;
import com.xiojuandawt.blood4life.entities.Image;
import com.xiojuandawt.blood4life.services.BloodDonorService;
import com.xiojuandawt.blood4life.services.HospitalService;
import com.xiojuandawt.blood4life.services.ImageService;
import com.xiojuandawt.blood4life.services.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

  // ----------------- BLOOD DONOR -----------------
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
        return errorResponse("Email already registered", HttpStatus.CONFLICT);
      }

      Image imageEntity = null;
      if (imageFile != null && !imageFile.isEmpty()) {
        String originalFilename = imageFile.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
            ? originalFilename.substring(originalFilename.lastIndexOf("."))
            : "";
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
      return errorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping("/bloodDonor/login")
  public ResponseEntity<?> loginBloodDonor(@RequestHeader("Authorization") String authHeader) {
    try {
      String[] credentials = extractCredentials(authHeader);
      String email = credentials[0];
      String password = credentials[1];

      Optional<BloodDonor> bloodDonorOpt = bloodDonorService.findByEmail(email);
      if (bloodDonorOpt.isEmpty()) {
        return errorResponse("Invalid credentials", HttpStatus.UNAUTHORIZED);
      }

      BloodDonor bloodDonor = bloodDonorOpt.get();
      if (!passwordEncoder.matches(password, bloodDonor.getPassword())) {
        return errorResponse("Invalid credentials", HttpStatus.UNAUTHORIZED);
      }

      String token = jwtService.generateToken(bloodDonor.getId(), "bloodDonor");
      ResponseCookie jwtCookie = ResponseCookie.from("jwt", token)
          .httpOnly(true)
          .secure(false)
          .path("/")
          .maxAge(24 * 60 * 60)
          .sameSite("Strict")
          .build();

      Map<String, Object> response = new HashMap<>();
      response.put("status", "OK");
      response.put("message", "Login successful");

      return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString()).body(response);

    } catch (IllegalArgumentException e) {
      return errorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  // ----------------- HOSPITAL -----------------
  @PostMapping("/hospital/register")
  public ResponseEntity<?> registerHospital(
      @RequestParam("cif") String cif,
      @RequestParam("name") String name,
      @RequestParam("address") String address,
      @RequestParam("email") String email,
      @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
      @RequestParam("password") String password,
      @RequestParam(value = "image", required = false) MultipartFile imageFile) {
    try {
      Optional<Hospital> existing = hospitalService.findHospitalByEmail(email);
      if (existing.isPresent()) {
        return errorResponse("Email already registered", HttpStatus.CONFLICT);
      }

      Image imageEntity = null;
      if (imageFile != null && !imageFile.isEmpty()) {
        String originalFilename = imageFile.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
            ? originalFilename.substring(originalFilename.lastIndexOf("."))
            : "";
        String imageFileName = UUID.randomUUID().toString() + extension;
        imageEntity = imageService.saveImage(imageFile, imageFileName);
      }

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
      return errorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping("/hospital/login")
  public ResponseEntity<?> loginHospital(@RequestHeader("Authorization") String authHeader) {
    try {
      String[] credentials = extractCredentials(authHeader);
      String email = credentials[0];
      String password = credentials[1];

      Optional<Hospital> hospitalOpt = hospitalService.findHospitalByEmail(email);
      if (hospitalOpt.isEmpty()) {
        return errorResponse("Invalid credentials", HttpStatus.UNAUTHORIZED);
      }

      Hospital hospital = hospitalOpt.get();
      if (!passwordEncoder.matches(password, hospital.getPassword())) {
        return errorResponse("Invalid credentials", HttpStatus.UNAUTHORIZED);
      }

      String token = jwtService.generateToken(hospital.getId(), "hospital");
      ResponseCookie jwtCookie = ResponseCookie.from("jwt", token)
          .httpOnly(true)
          .secure(false)
          .path("/")
          .maxAge(24 * 60 * 60)
          .sameSite("Strict")
          .build();

      Map<String, Object> response = new HashMap<>();
      response.put("status", "OK");
      response.put("message", "Login successful");

      return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString()).body(response);

    } catch (IllegalArgumentException e) {
      return errorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  // ----------------- UTIL -----------------
  private String[] extractCredentials(String authHeader) {
    if (authHeader == null || !authHeader.startsWith("Basic ")) {
      throw new IllegalArgumentException("Missing or invalid Authorization header");
    }
    String base64Credentials = authHeader.substring("Basic ".length());
    String decodedString = new String(Base64.getDecoder().decode(base64Credentials));
    if (!decodedString.contains(":")) {
      throw new IllegalArgumentException("Invalid Basic Auth format. Expected 'email:password'");
    }
    return decodedString.split(":", 2);
  }

  private ResponseEntity<Map<String, String>> errorResponse(String message, HttpStatus status) {
    Map<String, String> body = new HashMap<>();
    body.put("error", message);
    return ResponseEntity.status(status).body(body);
  }
}
