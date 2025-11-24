package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.entities.Image;
import com.xiojuandawt.blood4life.services.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "http://localhost:5173")
public class ImageController {

  @Autowired
  private ImageService imageService;

  @PostMapping("/upload")
  public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("image") MultipartFile file) {
    try {
      // Obtener extensión original
      String originalFilename = file.getOriginalFilename();
      String extension = "";
      if (originalFilename != null && originalFilename.contains(".")) {
        extension = originalFilename.substring(originalFilename.lastIndexOf("."));
      }

      // Generar nombre único
      String newFileName = UUID.randomUUID().toString() + extension;

      // Guardar imagen en disco y en base de datos
      Image image = imageService.saveImage(file, newFileName);

      // Crear respuesta
      Map<String, Object> response = new HashMap<>();
      response.put("message", "Imagen subida exitosamente");
      response.put("id", image.getId());          // <-- Devuelve ID de la imagen
      response.put("filename", image.getName());
      response.put("url", "/api/images/" + image.getName());

      return ResponseEntity.ok(response);

    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(Map.of("error", e.getMessage()));
    }
  }

  @GetMapping("/{imageName}")
  public ResponseEntity<byte[]> getImage(@PathVariable String imageName) {
    try {
      if (imageName.contains("..")) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
      }

      byte[] imageData = imageService.getImage(imageName);

      return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(determineContentType(imageName)))
        .body(imageData);

    } catch (IOException e) {
      return ResponseEntity.notFound().build();
    }
  }

  private String determineContentType(String filename) {
    filename = filename.toLowerCase();
    if (filename.endsWith(".png")) return "image/png";
    if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) return "image/jpeg";
    return "application/octet-stream";
  }
}
