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
  @Autowired
  private com.xiojuandawt.blood4life.services.AdminService adminService;

  // This method will be executed before reaching the controller to
  // tell Spring Boot if the user is logged in
  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain chain) throws ServletException, IOException {

    String token = null;

    // DEBUG: Log all cookies
    System.out.println("===== JWT FILTER DEBUG =====");
    System.out.println("Request URI: " + request.getRequestURI());
    if (request.getCookies() != null) {
      System.out.println("Cookies found: " + request.getCookies().length);
      for (Cookie cookie : request.getCookies()) {
        System.out.println("  Cookie: " + cookie.getName() + " = "
            + cookie.getValue().substring(0, Math.min(20, cookie.getValue().length())) + "...");
      }
    } else {
      System.out.println("NO COOKIES FOUND!");
    }

    // Extract token from cookie or header
    if (request.getCookies() != null) {
      token = Arrays.stream(request.getCookies())
          .filter(cookie -> "jwt".equals(cookie.getName()))
          .map(Cookie::getValue)
          .findFirst()
          .orElse(null);
    }

    if (token == null) {
      String authHeader = request.getHeader("Authorization");
      if (authHeader != null && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    // If no token found, continue without authentication
    if (token == null) {
      System.out.println("No JWT token found, continuing without auth");
      System.out.println("============================");
      chain.doFilter(request, response);
      return;
    }

    System.out.println("JWT token found!");

    // With our service we obtain the data stored in the token
    try {
      // We tried to read the token
      Claims userTokenPayload = jwtService.extractPayload(token);
      final Integer userId = userTokenPayload.get("id", Integer.class);
      final String userType = userTokenPayload.get("type", String.class);

      System.out.println("Token valid - User ID: " + userId + ", Type: " + userType);

      // If the token is valid and there is no prior authentication
      if (userId != null &&
          SecurityContextHolder.getContext().getAuthentication() == null) {

        switch (userType) {
          case "bloodDonor":
            this.authenticatedByBloodDonor(userId, token);
            break;
          case "hospital":
            this.authenticatedByHospital(userId, token);
            System.out.println("Hospital authentication set in SecurityContext");
            break;
          case "admin":
            this.authenticatedByAdmin(userId, token);
            break;
        }
      }

    } catch (Exception e) {

      // If the token is expired, corrupted, tampered with, or empty:
      // DO NOT break anything → ignore the token and continue without authentication
      System.out.println("Token validation failed: " + e.getMessage());
      SecurityContextHolder.clearContext();
    }

    System.out.println("============================");

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

  private void authenticatedByAdmin(Integer id, String token) {
    Optional<com.xiojuandawt.blood4life.entities.Admin> adminOptional = this.adminService.findById(id);
    List<GrantedAuthority> roles = new ArrayList<>();
    roles.add(new SimpleGrantedAuthority("ROLE_ADMIN"));

    if (!this.jwtService.isTokenExpired(token) && adminOptional.isPresent()) {
      com.xiojuandawt.blood4life.entities.Admin admin = adminOptional.orElseThrow();

      UsernamePasswordAuthenticationToken autheticationObject = new UsernamePasswordAuthenticationToken(
          admin, null, roles);

      SecurityContextHolder.getContext().setAuthentication(autheticationObject);
    }
  }
}
