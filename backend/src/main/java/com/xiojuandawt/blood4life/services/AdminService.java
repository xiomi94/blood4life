package com.xiojuandawt.blood4life.services;

import com.xiojuandawt.blood4life.entities.Admin;
import java.util.Optional;

public interface AdminService {
  Optional<Admin> findByEmail(String email);

  Optional<Admin> findById(Integer id);

  Admin save(Admin admin);
}
