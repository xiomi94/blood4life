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

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "blood_type_id")
  private BloodType bloodType;

  private String email;
  private String phoneNumber;
  private Date dateOfBirth;
  private String password;

  @ManyToOne
  @JoinColumn(name = "image_id", nullable = true)
  private Image image;

  public BloodDonor() {
  }

  public BloodDonor(String dni, String firstName, String lastName, String gender, BloodType bloodType,
      String email, String phoneNumber, Date dateOfBirth, String password, Image image) {
    this.dni = dni;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.bloodType = bloodType;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.dateOfBirth = dateOfBirth;
    this.password = password;
    this.image = image;
  }

  public BloodDonor(int id, String dni, String firstName, String lastName, String gender, BloodType bloodType,
      String email, String phoneNumber, Date dateOfBirth, String password, Image image) {
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
    this.image = image;
  }

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

  public BloodType getBloodType() {
    return bloodType;
  }

  public void setBloodType(BloodType bloodType) {
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

  public Image getImage() {
    return image;
  }

  public void setImage(Image image) {
    this.image = image;
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
        ", image=" + image +
        '}';
  }
}
