package com.xiojuandawt.blood4life.services;

import com.xiojuandawt.blood4life.dto.HospitalDTO;
import com.xiojuandawt.blood4life.entities.Hospital;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface HospitalService {

  List<HospitalDTO> findAll();

  HospitalDTO createNew(Hospital hospital);

  HospitalDTO update(Hospital hospital);

  void delete(int id);

  Optional<Hospital> findById(Integer id);

  Optional<Hospital> findHospitalByEmail(String email);
}
