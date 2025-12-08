package com.xiojuandawt.blood4life.services;

import com.xiojuandawt.blood4life.entities.Admin;
import com.xiojuandawt.blood4life.repositories.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {

  @Autowired
  private AdminRepository adminRepository;

  @Override
  public Optional<Admin> findByEmail(String email) {
    return adminRepository.findByEmail(email);
  }

  @Override
  public Optional<Admin> findById(Integer id) {
    return adminRepository.findById(id);
  }

  @Override
  public Admin save(Admin admin) {
    return adminRepository.save(admin);
  }
}
