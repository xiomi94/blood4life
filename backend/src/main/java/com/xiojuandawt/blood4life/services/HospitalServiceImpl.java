package com.xiojuandawt.blood4life.services;

import com.xiojuandawt.blood4life.dto.HospitalDTO;
import com.xiojuandawt.blood4life.entities.Hospital;
import com.xiojuandawt.blood4life.exception.ResourceNotFoundException;
import com.xiojuandawt.blood4life.repositories.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class HospitalServiceImpl implements HospitalService {

  @Autowired
  private HospitalRepository hospitalRepository;

  @Autowired
  private ImageService imageService;

  public ImageService getImageService() {
    return imageService;
  }

  @Override
  public List<HospitalDTO> findAll() {
    List<Hospital> hospitalList = (List<Hospital>) hospitalRepository.findAll();
    List<HospitalDTO> dtoList = new ArrayList<>();
    for (Hospital hospital : hospitalList) {
      dtoList.add(parseEntityToDTO(hospital));
    }
    return dtoList;
  }

  @Override
  @Transactional
  public HospitalDTO createNew(Hospital hospital) {
    Hospital saved = hospitalRepository.save(hospital);
    return parseEntityToDTO(saved);
  }

  @Override
  @Transactional
  public HospitalDTO update(Hospital hospital) {
    if (hospitalRepository.findById(hospital.getId()).isEmpty()) {
      throw new ResourceNotFoundException("Hospital not found with id " + hospital.getId());
    }
    Hospital updated = hospitalRepository.save(hospital);
    return parseEntityToDTO(updated);
  }

  @Override
  @Transactional
  public void delete(int id) {
    if (hospitalRepository.findById(id).isEmpty()) {
      throw new ResourceNotFoundException("Hospital not found with id " + id);
    }
    hospitalRepository.deleteById(id);
  }

  @Override
  public Optional<Hospital> findById(Integer id) {
    return hospitalRepository.findById(id);
  }

  @Override
  public Optional<Hospital> findHospitalByEmail(String email) {
    return hospitalRepository.findHospitalByEmail(email);
  }

  private HospitalDTO parseEntityToDTO(Hospital hospital) {
    HospitalDTO dto = new HospitalDTO();
    dto.setId(hospital.getId());
    dto.setCif(hospital.getCif());
    dto.setName(hospital.getName());
    dto.setAddress(hospital.getAddress());
    dto.setPostalCode(hospital.getPostalCode());
    dto.setEmail(hospital.getEmail());
    dto.setPhoneNumber(hospital.getPhoneNumber());
    if (hospital.getImage() != null) {
      dto.setImageName(hospital.getImage().getName());
    }
    return dto;
  }
}
