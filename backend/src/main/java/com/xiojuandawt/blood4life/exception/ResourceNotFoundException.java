package com.xiojuandawt.blood4life.exception;

public class ResourceNotFoundException extends RuntimeException {

  public ResourceNotFoundException(String message) {
    super(message);
  }

  public ResourceNotFoundException() {
    super("No se ha encontrado");
  }

}
