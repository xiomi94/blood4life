package com.xiojuandawt.blood4life.repositories;

import com.xiojuandawt.blood4life.entities.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Integer> {
  Optional<Hospital> findHospitalById(int id);

  Optional<Hospital> findHospitalByEmail(String email);
}
