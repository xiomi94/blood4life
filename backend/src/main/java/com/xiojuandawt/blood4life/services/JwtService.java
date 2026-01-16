package com.xiojuandawt.blood4life.services;

import io.jsonwebtoken.Claims;

public interface JwtService {

  String generateToken(Integer entityId, String entityType);

  Claims extractPayload(String token);

  public boolean isTokenExpired(String token);

  public boolean shouldRefreshToken(String token);
}
