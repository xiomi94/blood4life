package com.xiojuandawt.blood4life.entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "campaign")
public class Campaign {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @ManyToOne
  @JoinColumn(name = "hospital_id", nullable = false)
  private Hospital hospital;

  @Column
  private String name;

  @Column
  private String description;

  @Column(name = "start_date")
  private LocalDate startDate;

  @Column(name = "end_date")
  private LocalDate endDate;

  @Column
  private String location;

  @Column(name = "required_donor_quantity", nullable = false)
  private Integer requiredDonorQuantity;

  @Column(name = "required_blood_type", nullable = false)
  private String requiredBloodType;

  @ManyToMany
  @JoinTable(name = "blood_type_campaign", joinColumns = @JoinColumn(name = "campaign"), inverseJoinColumns = @JoinColumn(name = "blood_type"))
  private List<BloodType> bloodTypes;

  public Campaign() {
  }

  public Campaign(Hospital hospital, String name, String description, LocalDate startDate, LocalDate endDate,
      String location, Integer requiredDonorQuantity, String requiredBloodType) {
    this.hospital = hospital;
    this.name = name;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.location = location;
    this.requiredDonorQuantity = requiredDonorQuantity;
    this.requiredBloodType = requiredBloodType;
  }

  public Campaign(Integer id, Hospital hospital, String name, String description, LocalDate startDate,
      LocalDate endDate, String location, Integer requiredDonorQuantity, String requiredBloodType) {
    this.id = id;
    this.hospital = hospital;
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

  public Hospital getHospital() {
    return hospital;
  }

  public void setHospital(Hospital hospital) {
    this.hospital = hospital;
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

  public List<BloodType> getBloodTypes() {
    return bloodTypes;
  }

  public void setBloodTypes(List<BloodType> bloodTypes) {
    this.bloodTypes = bloodTypes;
  }
}
