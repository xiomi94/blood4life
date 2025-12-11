package com.xiojuandawt.blood4life.repositories;

import com.xiojuandawt.blood4life.entities.Campaign;
import com.xiojuandawt.blood4life.entities.Hospital;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CampaignRepository extends CrudRepository<Campaign, Integer> {
    Optional<Campaign> findById(Integer id);

    List<Campaign> findByHospitalId(Integer hospitalId);

    long countByHospital(Hospital hospital);

    List<Campaign> findAll();
}
