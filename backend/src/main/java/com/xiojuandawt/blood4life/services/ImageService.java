package com.xiojuandawt.blood4life.services;

import com.xiojuandawt.blood4life.entities.Image;
import com.xiojuandawt.blood4life.repositories.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ImageService {

  @Autowired
  private ImageRepository imageRepository;

  private final String uploadDir = "uploads/";

  public Image saveImage(MultipartFile multipartFile, String fileName) throws IOException {

    Path filepath = Paths.get(uploadDir + fileName);
    Files.createDirectories(filepath.getParent());
    Files.write(filepath, multipartFile.getBytes());

    Image image = new Image(fileName);
    return imageRepository.save(image);
  }

  public byte[] getImage(String filename) throws IOException {
    Path path = Paths.get(uploadDir + filename);
    return Files.readAllBytes(path);
  }
}
