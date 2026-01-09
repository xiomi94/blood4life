package com.xiojuandawt.blood4life.entities;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "blood_type")
public class BloodType {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String type;

  @com.fasterxml.jackson.annotation.JsonIgnore
  @ManyToMany(mappedBy = "bloodTypes")
  private List<Campaign> campaigns;

  public BloodType() {
  }

  public BloodType(String type) {
    this.type = type;
  }

  public BloodType(Integer id, String type) {
    this.id = id;
    this.type = type;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  @Override
  public String toString() {
    return "BloodType{" +
        "id=" + id +
        ", type='" + type + '\'' +
        '}';
  }
}
