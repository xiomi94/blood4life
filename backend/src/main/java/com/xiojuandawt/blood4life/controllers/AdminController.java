package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.dto.BloodDonorDTO;
import com.xiojuandawt.blood4life.dto.HospitalDTO;
import com.xiojuandawt.blood4life.entities.BloodDonor;
import com.xiojuandawt.blood4life.entities.Hospital;
import com.xiojuandawt.blood4life.services.BloodDonorService;
import com.xiojuandawt.blood4life.services.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

  @Autowired
  private BloodDonorService bloodDonorService;

  @Autowired
  private HospitalService hospitalService;


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
}
