package com.xiojuandawt.blood4life.repositories;

import com.xiojuandawt.blood4life.entities.BloodDonor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BloodDonorRepository extends CrudRepository<BloodDonor, Integer> {
  Optional<BloodDonor> findByEmail(String email);

  Optional<BloodDonor> findById(Integer id);

  @Query("SELECT b.bloodType.bloodType, COUNT(b) FROM BloodDonor b GROUP BY b.bloodType.bloodType")
  java.util.List<Object[]> countDonorsByBloodType();

  @Query("SELECT b.gender, COUNT(b) FROM BloodDonor b GROUP BY b.gender")
  java.util.List<Object[]> countDonorsByGender();
}
