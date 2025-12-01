package com.xiojuandawt.blood4life.dto;

public class AdminDTO {

  private Integer id;
  private String email;

  public AdminDTO() {
  }

  public AdminDTO(String email) {
    this.email = email;
  }

  public AdminDTO(Integer id, String email) {
    this.id = id;
    this.email = email;
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
}
