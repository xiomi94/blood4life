package com.xiojuandawt.blood4life.dto;

import java.time.LocalDate;

public class CampaignDTO {
    private Integer id;
    private Integer hospitalId;
    private String hospitalName;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
    private Integer requiredDonorQuantity;
    private String requiredBloodType;

    public CampaignDTO() {
    }

    public CampaignDTO(Integer id, Integer hospitalId, String hospitalName, String name, String description,
            LocalDate startDate, LocalDate endDate, String location,
            Integer requiredDonorQuantity, String requiredBloodType) {
        this.id = id;
        this.hospitalId = hospitalId;
        this.hospitalName = hospitalName;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.location = location;
        this.requiredDonorQuantity = requiredDonorQuantity;
        this.requiredBloodType = requiredBloodType;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Integer hospitalId) {
        this.hospitalId = hospitalId;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getRequiredDonorQuantity() {
        return requiredDonorQuantity;
    }

    public void setRequiredDonorQuantity(Integer requiredDonorQuantity) {
        this.requiredDonorQuantity = requiredDonorQuantity;
    }

    public String getRequiredBloodType() {
        return requiredBloodType;
    }

    public void setRequiredBloodType(String requiredBloodType) {
        this.requiredBloodType = requiredBloodType;
    }
}
