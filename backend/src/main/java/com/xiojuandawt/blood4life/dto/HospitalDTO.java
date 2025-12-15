package com.xiojuandawt.blood4life.dto;

public class HospitalDTO {

  private int id;
  private String cif;
  private String name;
  private String address;
  private String postalCode;
  private String email;
  private String phoneNumber;
  private String imageName; // nuevo campo para la imagen

  public HospitalDTO() {
  }

  public HospitalDTO(int id, String cif, String name, String address, String postalCode, String email,
      String phoneNumber,
      String imageName) {
    this.id = id;
    this.cif = cif;
    this.name = name;
    this.address = address;
    this.postalCode = postalCode;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.imageName = imageName;
  }

  public HospitalDTO(String cif, String name, String address, String postalCode, String email, String phoneNumber,
      String imageName) {
    this.cif = cif;
    this.name = name;
    this.address = address;
    this.postalCode = postalCode;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.imageName = imageName;
  }

  // getters y setters

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getCif() {
    return cif;
  }

  public void setCif(String cif) {
    this.cif = cif;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public String getPostalCode() {
    return postalCode;
  }

  public void setPostalCode(String postalCode) {
    this.postalCode = postalCode;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
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

  public String getImageName() {
    return imageName;
  }

  public void setImageName(String imageName) {
    this.imageName = imageName;
  }
}
