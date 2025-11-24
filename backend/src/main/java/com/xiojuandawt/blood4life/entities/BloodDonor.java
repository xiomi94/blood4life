package com.xiojuandawt.blood4life.entities;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "blood_donor")
public class BloodDonor {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String dni;
  private String firstName;
  private String lastName;
  private String gender;

  @JoinColumn(name = "blood_type_id")
  private String bloodType;

  private String email;
  private String phoneNumber;
  private Date dateOfBirth;
  private String password;

  public BloodDonor() {
  }

  public BloodDonor(String dni, String firstName, String lastName, String gender, String bloodType,
                    String email, String phoneNumber, Date dateOfBirth, String password) {
    this.dni = dni;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.bloodType = bloodType;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.dateOfBirth = dateOfBirth;
    this.password = password;
  }

  public BloodDonor(int id, String dni, String firstName, String lastName, String gender, String bloodType,
                    String email, String phoneNumber, Date dateOfBirth, String password) {
    this.id = id;
    this.dni = dni;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.bloodType = bloodType;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.dateOfBirth = dateOfBirth;
    this.password = password;
  }

  // Getters y setters
  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
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
    return bloodType;
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

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  @Override
  public String toString() {
    return "BloodDonor{" +
      "id=" + id +
      ", dni='" + dni + '\'' +
      ", firstName='" + firstName + '\'' +
      ", lastName='" + lastName + '\'' +
      ", gender='" + gender + '\'' +
      ", bloodType=" + bloodType +
      ", email='" + email + '\'' +
      ", phoneNumber='" + phoneNumber + '\'' +
      ", dateOfBirth=" + dateOfBirth +
      ", password='" + password + '\'' +
      '}';
  }
}
