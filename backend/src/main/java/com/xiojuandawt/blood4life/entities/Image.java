package com.xiojuandawt.blood4life.entities;

import jakarta.persistence.*;

@Entity
public class Image {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(name = "file_name")
  private String name;

  public Image() {}

  public Image(String name) {
    this.name = name;
  }


  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}