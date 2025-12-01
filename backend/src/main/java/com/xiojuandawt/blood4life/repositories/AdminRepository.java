package com.xiojuandawt.blood4life.repositories;


import com.xiojuandawt.blood4life.entities.Admin;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends CrudRepository<Admin, Integer> {

  Optional<Admin> findByEmail(String email);
}
