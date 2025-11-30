package com.xiojuandawt.blood4life.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "admin")
public class Admin {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String emaill;
  private String password;

  public Admin() {
  }

  public Admin(Integer id, String emaill, String password) {
    this.id = id;
    this.emaill = emaill;
    this.password = password;
  }

  public Admin(String emaill, String password) {
    this.emaill = emaill;
    this.password = password;
  }

  public Integer getId() {
    return this.id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getEmaill() {
    return this.emaill;
  }

  public void setEmaill(String emaill) {
    this.emaill = emaill;
  }

  public String getPassword() {
    return this.password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}
