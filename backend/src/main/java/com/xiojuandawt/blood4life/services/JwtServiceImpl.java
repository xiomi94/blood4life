package com.xiojuandawt.blood4life.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtServiceImpl implements JwtService {

  @Value("${application.security.jwt.secret-key}")
  private String SECRET_KEY;
  private final long EXPIRATION_TIME = 1000 * 60 * 60;

  @Override
  public String generateToken(Integer EntityId, String entityType) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("id", EntityId);
    claims.put("type", entityType);

    return Jwts.builder()
      .claims(claims) // Adding identity id and identity type to the token
      .issuedAt(new Date(System.currentTimeMillis())) // Token creation date
      .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // Token expiration date
      .signWith(this.getSigningKey(), Jwts.SIG.HS256) // Sign token with secret key
      .compact(); // Create token
  }

  @Override
  public Claims extractPayload(String token) {
    return Jwts.parser()
      .verifyWith(this.getSigningKey()) // Verify token with sign
      .build()
      .parseSignedClaims(token) // Parse token to data
      .getPayload(); // Obtain token data
  }

  private SecretKey getSigningKey() {
    return Keys.hmacShaKeyFor(this.SECRET_KEY.getBytes());
  }

  public boolean isTokenExpired(String token) {
    Date expiration = Jwts.parser()
      .verifyWith(getSigningKey())
      .build()
      .parseSignedClaims(token)
      .getPayload()
      .getExpiration();
    return expiration.before(new Date(System.currentTimeMillis()));
  }
}

