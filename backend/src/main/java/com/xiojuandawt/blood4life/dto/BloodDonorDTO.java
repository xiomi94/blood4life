package com.xiojuandawt.blood4life.dto;

import com.xiojuandawt.blood4life.entities.BloodType;

import java.util.Date;

public class BloodDonorDTO {

  private int id;
  private String dni;
  private String firstName;
  private String lastName;
  private String gender;
  private String bloodType;
  private String email;
  private String phoneNumber;
  private Date dateOfBirth;

  public BloodDonorDTO() {
  }

  public BloodDonorDTO(int id, String dni, String firstName, String lastName, String gender, String bloodType, String email, String phoneNumber, Date dateOfBirth) {
    this.id = id;
    this.dni = dni;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.bloodType = bloodType;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.dateOfBirth = dateOfBirth;
  }


  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getDni() {
    return dni;
  }

  public void setDni(String dni) {
    this.dni = dni;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getGender() {
    return gender;
  }

  public void setGender(String gender) {
    this.gender = gender;
  }

  public String getBloodType() {
    return this.bloodType;
  }

  public void setBloodType(String bloodType) {
    this.bloodType = bloodType;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public Date getDateOfBirth() {
    return dateOfBirth;
  }

  public void setDateOfBirth(Date dateOfBirth) {
    this.dateOfBirth = dateOfBirth;
  }
}
