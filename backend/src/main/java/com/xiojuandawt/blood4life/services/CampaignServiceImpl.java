package com.xiojuandawt.blood4life.services;

import com.xiojuandawt.blood4life.dto.CampaignDTO;
import com.xiojuandawt.blood4life.entities.BloodType;
import com.xiojuandawt.blood4life.entities.Campaign;
import com.xiojuandawt.blood4life.repositories.BloodTypeRepository;
import com.xiojuandawt.blood4life.repositories.CampaignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CampaignServiceImpl implements CampaignService {

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private com.xiojuandawt.blood4life.repositories.AppointmentRepository appointmentRepository;

    @Autowired
    private BloodTypeRepository bloodTypeRepository;

    @Override
    public CampaignDTO createCampaign(Campaign campaign, List<String> bloodTypeStrings) {
        // Set the requiredBloodType string (comma-separated)
        campaign.setRequiredBloodType(String.join(",", bloodTypeStrings));

        // Find and set BloodType entities for ManyToMany relationship
        List<BloodType> bloodTypes = new ArrayList<>();
        List<BloodType> allBloodTypes = bloodTypeRepository.findAll();

        for (String bloodTypeStr : bloodTypeStrings) {
            allBloodTypes.stream()
                    .filter(bt -> bt.getType().equalsIgnoreCase(bloodTypeStr.trim()))
                    .findFirst()
                    .ifPresent(bloodTypes::add);
        }

        campaign.setBloodTypes(bloodTypes);

        // Save campaign
        Campaign savedCampaign = campaignRepository.save(campaign);

        return parseEntityToDTO(savedCampaign);
    }

    @Override
    public Optional<Campaign> findById(Integer id) {
        return campaignRepository.findById(id);
    }

    @Override
    public List<CampaignDTO> findByHospitalId(Integer hospitalId) {
        List<Campaign> campaigns = campaignRepository.findByHospitalId(hospitalId);
        return campaigns.stream()
                .map(this::parseEntityToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CampaignDTO> findAll() {
        List<Campaign> campaigns = campaignRepository.findAll();
        return campaigns.stream()
                .map(this::parseEntityToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CampaignDTO parseEntityToDTO(Campaign campaign) {
        CampaignDTO dto = new CampaignDTO(
                campaign.getId(),
                campaign.getHospital().getId(),
                campaign.getHospital().getName(),
                campaign.getName(),
                campaign.getDescription(),
                campaign.getStartDate(),
                campaign.getEndDate(),
                campaign.getLocation(),
                campaign.getRequiredDonorQuantity(),
                campaign.getRequiredBloodType());

        if (campaign.getId() != null) {
            Integer count = appointmentRepository.countByCampaignId(campaign.getId());
            dto.setCurrentDonorCount(count.intValue());
        } else {
            dto.setCurrentDonorCount(0);
        }

        return dto;
    }

    public void setBloodTypes(Campaign campaign, List<BloodType> bloodTypes) {
        campaign.setBloodTypes(bloodTypes);
    }

    @Override
    public CampaignDTO updateCampaign(Integer id, Campaign updatedCampaign, List<String> bloodTypeStrings) {
        // Find existing campaign
        Campaign existingCampaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaña no encontrada con el id: " + id));

        // Update fields
        existingCampaign.setName(updatedCampaign.getName());
        existingCampaign.setDescription(updatedCampaign.getDescription());
        existingCampaign.setStartDate(updatedCampaign.getStartDate());
        existingCampaign.setEndDate(updatedCampaign.getEndDate());
        existingCampaign.setLocation(updatedCampaign.getLocation());
        existingCampaign.setRequiredDonorQuantity(updatedCampaign.getRequiredDonorQuantity());

        // Update blood types
        existingCampaign.setRequiredBloodType(String.join(",", bloodTypeStrings));

        List<BloodType> bloodTypes = new ArrayList<>();
        List<BloodType> allBloodTypes = bloodTypeRepository.findAll();

        for (String bloodTypeStr : bloodTypeStrings) {
            allBloodTypes.stream()
                    .filter(bt -> bt.getType().equalsIgnoreCase(bloodTypeStr.trim()))
                    .findFirst()
                    .ifPresent(bloodTypes::add);
        }

        existingCampaign.setBloodTypes(bloodTypes);

        // Save updated campaign
        Campaign savedCampaign = campaignRepository.save(existingCampaign);

        return parseEntityToDTO(savedCampaign);
    }

    @Override
    public void deleteCampaign(Integer id) {
        // Verify campaign exists
        if (!campaignRepository.existsById(id)) {
            throw new RuntimeException("Campaña no encontrada con el id: " + id);
        }

        // Delete campaign
        campaignRepository.deleteById(id);
    }
}
