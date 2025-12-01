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
  public ResponseEntity<?> updateHospital(@Valid @RequestBody Hospital updatedHospital) {
    try {
      HospitalDTO hospitalDTO = hospitalService.update(updatedHospital);
      return ResponseEntity.ok(hospitalDTO);
    } catch (ResourceNotFoundException e) {
      Map<String, String> body = new HashMap<>();
      body.put("error", "No se ha encontrado el hospital con id " + updatedHospital.getId());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
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
