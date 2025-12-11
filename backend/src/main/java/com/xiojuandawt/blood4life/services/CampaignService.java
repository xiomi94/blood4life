package com.xiojuandawt.blood4life.services;

import com.xiojuandawt.blood4life.dto.CampaignDTO;
import com.xiojuandawt.blood4life.entities.Campaign;

import java.util.List;
import java.util.Optional;

public interface CampaignService {
    CampaignDTO createCampaign(Campaign campaign, List<String> bloodTypeStrings);

    Optional<Campaign> findById(Integer id);

    List<CampaignDTO> findByHospitalId(Integer hospitalId);

    List<CampaignDTO> findAll();

    CampaignDTO parseEntityToDTO(Campaign campaign);
}
