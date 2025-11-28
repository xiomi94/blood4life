package com.xiojuandawt.blood4life.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "hospital")
public class Hospital {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String cif;
  private String name;
  private String address;
  private String email;
  private String phoneNumber;
  private String password;

  @ManyToOne
  @JoinColumn(name = "image_id", nullable = true)
  private Image image;

  public Hospital() {
  }

  public Hospital(int id, String cif, String name, String address, String email, String phoneNumber, String password,
      Image image) {
    this.id = id;
    this.cif = cif;
    this.name = name;
    this.address = address;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.image = image;
  }

  public Hospital(String cif, String name, String address, String email, String phoneNumber, String password,
      Image image) {
    this.cif = cif;
    this.name = name;
    this.address = address;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.image = image;
  }

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

  public String getPassword() {
    return password;
  }

  public Image getImage() {
    return image;
  }

  public void setImage(Image image) {
    this.image = image;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  @Override
  public String toString() {
    return "Hospital{" +
        "id=" + id +
        ", cif='" + cif + '\'' +
        ", name='" + name + '\'' +
        ", address='" + address + '\'' +
        ", email='" + email + '\'' +
        ", phoneNumber='" + phoneNumber + '\'' +
        ", password='" + password + '\'' +
        ", image=" + image +
        '}';
  }
}
