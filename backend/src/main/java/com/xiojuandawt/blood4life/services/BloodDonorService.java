package com.xiojuandawt.blood4life.services;

import com.xiojuandawt.blood4life.dto.BloodDonorDTO;
import com.xiojuandawt.blood4life.entities.BloodDonor;
import com.xiojuandawt.blood4life.entities.BloodType;

import java.util.List;
import java.util.Optional;

public interface BloodDonorService {

  List<BloodDonorDTO> findAll();

  BloodDonorDTO createNew(BloodDonor bloodDonor);

  BloodDonorDTO update(BloodDonor bloodDonor, Integer id);

  void delete(int id);

  Optional<BloodDonor> findByEmail(String email);

  Optional<BloodDonor> findByIdWithRole(Integer id);

  Optional<BloodType> findBloodTypeById(Integer bloodTypeId);
}
