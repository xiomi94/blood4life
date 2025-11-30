package com.xiojuandawt.blood4life.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "admin")
public class Admin {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String email;
  private String password;

  public Admin() {
  }

  public Admin(Integer id, String email, String password) {
    this.id = id;
    this.email = email;
    this.password = password;
  }

  public Admin(String email, String password) {
    this.email = email;
    this.password = password;
  }

  public Integer getId() {
    return this.id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getEmail() {
    return this.email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return this.password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}
