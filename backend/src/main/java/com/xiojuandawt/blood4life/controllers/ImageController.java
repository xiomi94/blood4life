package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.services.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/images")
public class ImageController {

    @Autowired
    private ImageService imageService;

    @GetMapping("/{filename:.+}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            byte[] imageBytes = imageService.getImage(filename);

            // Determine media type based on file extension
            String mediaType = MediaType.IMAGE_JPEG_VALUE;
            if (filename.endsWith(".png")) {
                mediaType = MediaType.IMAGE_PNG_VALUE;
            } else if (filename.endsWith(".gif")) {
                mediaType = MediaType.IMAGE_GIF_VALUE;
            } else if (filename.endsWith(".webp")) {
                mediaType = "image/webp";
            }

            return ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.parseMediaType(mediaType))
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
