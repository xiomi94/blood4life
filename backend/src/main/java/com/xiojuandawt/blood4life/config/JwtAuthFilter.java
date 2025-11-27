package com.xiojuandawt.blood4life.config;

import com.xiojuandawt.blood4life.entities.BloodDonor;
import com.xiojuandawt.blood4life.entities.Hospital;
import com.xiojuandawt.blood4life.services.BloodDonorService;
import com.xiojuandawt.blood4life.services.HospitalService;
import com.xiojuandawt.blood4life.services.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

  @Autowired
  private JwtService jwtService;
  @Autowired
  private BloodDonorService bloodDonorService;
  @Autowired
  private HospitalService hospitalService;

  // This method will be executed before reaching the controller to
  // tell Spring Boot if the user is logged in
  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain chain) throws ServletException, IOException {

    String token = null;

    // Extract token from cookie
    if (request.getCookies() != null) {
      token = Arrays.stream(request.getCookies())
          .filter(cookie -> "jwt".equals(cookie.getName()))
          .map(Cookie::getValue)
          .findFirst()
          .orElse(null);
    }

    // If no token found, continue without authentication
    if (token == null) {
      chain.doFilter(request, response);
      return;
    }

    // With our service we obtain the data stored in the token
    try {
      // We tried to read the token
      Claims userTokenPayload = jwtService.extractPayload(token);
      final Integer userId = userTokenPayload.get("id", Integer.class);
      final String userType = userTokenPayload.get("type", String.class);

      // If the token is valid and there is no prior authentication
      if (userId != null &&
          SecurityContextHolder.getContext().getAuthentication() == null) {

        switch (userType) {
          case "bloodDonor":
            this.authenticatedByBloodDonor(userId, token);
            break;
          case "hospital":
            this.authenticatedByHospital(userId, token);
            break;
        }
      }

    } catch (Exception e) {

      // If the token is expired, corrupted, tampered with, or empty:
      // DO NOT break anything → ignore the token and continue without authentication
      SecurityContextHolder.clearContext();
    }

    chain.doFilter(request, response);
  }

  private void authenticatedByBloodDonor(Integer id, String token) {
    // We check if that user exists in the database
    // There are many alternatives; they have both disadvantages and advantages.
    Optional<BloodDonor> bloodDonorOptional = bloodDonorService.findByIdWithRole(id);
    List<GrantedAuthority> roles = new ArrayList<>();
    roles.add(new SimpleGrantedAuthority("ROLE_BLOODDONOR"));

    // We check if the token has expired
    if (!this.jwtService.isTokenExpired(token) && bloodDonorOptional.isPresent()) {
      BloodDonor bloodDonor = bloodDonorOptional.orElseThrow();

      // We created the authentication using a Spring Boot class
      UsernamePasswordAuthenticationToken autheticationObject = new UsernamePasswordAuthenticationToken(
          bloodDonor, null, roles);

      // We add to the context of the request that the user is logged in
      // IMPORTANT: THIS STEP TELLS SPRING BOOT THAT THE USER IS LOGGED IN
      // This context can be obtained from the controller.
      SecurityContextHolder.getContext().setAuthentication(autheticationObject);
    }
  }

  private void authenticatedByHospital(Integer id, String token) {
    // We check if that user exists in the database
    // There are many alternatives; they have both disadvantages and advantages.
    Optional<Hospital> hospitalOptional = this.hospitalService.findById(id);
    List<GrantedAuthority> roles = new ArrayList<>();
    roles.add(new SimpleGrantedAuthority("ROLE_HOSPITAL"));

    // We check if the token has expired
    if (!this.jwtService.isTokenExpired(token) && hospitalOptional.isPresent()) {
      Hospital hospital = hospitalOptional.orElseThrow();

      // We created the authentication using a Spring Boot class
      UsernamePasswordAuthenticationToken autheticationObject = new UsernamePasswordAuthenticationToken(
          hospital, null, roles);

      // We add to the context of the request that the user is logged in
      // IMPORTANT: THIS STEP TELLS SPRING BOOT THAT THE USER IS LOGGED IN
      // This context can be obtained from the controller.
      SecurityContextHolder.getContext().setAuthentication(autheticationObject);
    }
  }

}
