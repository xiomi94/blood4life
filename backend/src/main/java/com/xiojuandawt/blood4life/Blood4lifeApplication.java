package com.xiojuandawt.blood4life;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Blood4lifeApplication {

  public static void main(String[] args) {
    SpringApplication.run(Blood4lifeApplication.class, args);
  }

  @org.springframework.context.annotation.Bean
  @org.springframework.transaction.annotation.Transactional
  public org.springframework.boot.CommandLineRunner dataCleanup(
      com.xiojuandawt.blood4life.repositories.BloodDonorRepository bloodDonorRepository,
      com.xiojuandawt.blood4life.repositories.BloodTypeRepository bloodTypeRepository) {
    return args -> {
      // Cleanup invalid gender
      bloodDonorRepository.deleteByGender("Male");

      // Fix missing blood types
      java.util.List<com.xiojuandawt.blood4life.entities.BloodDonor> donorsWithoutBloodType = bloodDonorRepository
          .findByBloodTypeIsNull();
      if (!donorsWithoutBloodType.isEmpty()) {
        java.util.List<com.xiojuandawt.blood4life.entities.BloodType> allTypes = bloodTypeRepository.findAll();
        if (!allTypes.isEmpty()) {
          // Default to O+ or the first available type
          com.xiojuandawt.blood4life.entities.BloodType defaultType = allTypes.stream()
              .filter(t -> t.getType() != null && "O+".equalsIgnoreCase(t.getType().trim()))
              .findFirst()
              .orElse(allTypes.get(0));

          for (com.xiojuandawt.blood4life.entities.BloodDonor donor : donorsWithoutBloodType) {
            donor.setBloodType(defaultType);
            bloodDonorRepository.save(donor);
          }
        }
      }
    };
  }
}
