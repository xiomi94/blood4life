package com.xiojuandawt.blood4life.services;

import com.xiojuandawt.blood4life.dto.BloodDonorDTO;
import com.xiojuandawt.blood4life.entities.BloodDonor;
import com.xiojuandawt.blood4life.entities.BloodType;
import com.xiojuandawt.blood4life.exception.ResourceNotFoundException;
import com.xiojuandawt.blood4life.repositories.BloodDonorRepository;
import com.xiojuandawt.blood4life.repositories.BloodTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BloodDonorServiceImpl implements BloodDonorService{

  @Autowired
  private BloodDonorRepository bloodDonorRepository;

  @Autowired
  private BloodTypeRepository bloodTypeRepository;

  @Autowired
  private BloodDonorWebSocketService bloodDonorWebSocketService;

  @Override
  public List<BloodDonorDTO> findAll() {
    List<BloodDonor> bloodDonorList = (List<BloodDonor>) this.bloodDonorRepository.findAll();
    List<BloodDonorDTO> bloodDonorDTOList = new ArrayList<>();

    for (BloodDonor bloodDonor: bloodDonorList) {
      BloodDonorDTO bloodDonorDTO = this.parseEntityToDto(bloodDonor);

      bloodDonorDTOList.add(bloodDonorDTO);
    }

    return bloodDonorDTOList;
  }

  @Override
  public BloodDonorDTO createNew(BloodDonor bloodDonor) {
    BloodDonor newBloodDonor = this.bloodDonorRepository.save(bloodDonor);

    return this.parseEntityToDto(newBloodDonor);
  }

  @Override
  public BloodDonorDTO update(BloodDonor bloodDonor, Integer id) {
    Optional<BloodDonor> bloodDonorInDatabase = this.bloodDonorRepository.findById(id);

    if (bloodDonorInDatabase.isEmpty()) {
      throw new ResourceNotFoundException();
    }

    bloodDonor.setId(id);
    bloodDonor.setPassword(bloodDonorInDatabase.orElseThrow().getPassword());
    BloodDonor updatedBloodDonor = this.bloodDonorRepository.save(bloodDonor);
    BloodDonorDTO updatedBloodDonorDTO = this.parseEntityToDto(updatedBloodDonor);

    return updatedBloodDonorDTO;
  }

  @Override
  public void delete(int id) {
    this.bloodDonorRepository.deleteById(id);

    long totalBloodDonors = bloodDonorRepository.count();
    bloodDonorWebSocketService.sentTotalBloodDonors(totalBloodDonors);
  }

  public Optional<BloodDonor> findByEmail(String email) {
    return bloodDonorRepository.findByEmail(email);
  }

  public BloodDonorDTO parseEntityToDto(BloodDonor bloodDonor) {
    BloodDonorDTO bloodDonorDTO = new BloodDonorDTO();
    bloodDonorDTO.setId(bloodDonor.getId());
    bloodDonorDTO.setDni(bloodDonor.getDni());
    bloodDonorDTO.setFirstName(bloodDonor.getFirstName());
    bloodDonorDTO.setLastName(bloodDonor.getLastName());
    bloodDonorDTO.setGender(bloodDonor.getGender());
    bloodDonorDTO.setEmail(bloodDonor.getEmail());
    bloodDonorDTO.setPhoneNumber(bloodDonor.getPhoneNumber());
    bloodDonorDTO.setDateOfBirth(bloodDonor.getDateOfBirth());

    return bloodDonorDTO;
  }

  @Override
  public Optional<BloodType> findBloodTypeById(Integer bloodTypeId) {
    return bloodTypeRepository.findById(bloodTypeId);
  }


  @Override
  public Optional<BloodDonor> findByIdWithRole(Integer id) {
    return this.bloodDonorRepository.findById(id);
  }

}
