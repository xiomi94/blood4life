package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.entities.BloodDonor;
import com.xiojuandawt.blood4life.entities.Hospital;
import com.xiojuandawt.blood4life.services.PushNotificationService;
import nl.martijndwars.webpush.Subscription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/push")
public class PushController {

    @Autowired
    private PushNotificationService pushService;

    @GetMapping("/vapid-public-key")
    public ResponseEntity<Map<String, String>> getPublicKey() {
        return ResponseEntity.ok(Map.of("publicKey", pushService.getPublicKey()));
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Void> subscribe(@RequestBody Subscription subscription,
            Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Object principal = authentication.getPrincipal();
        BloodDonor donor = null;
        Hospital hospital = null;

        if (principal instanceof BloodDonor) {
            donor = (BloodDonor) principal;
        } else if (principal instanceof Hospital) {
            hospital = (Hospital) principal;
        } else {
            // Admin or unknown
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        pushService.subscribe(subscription, donor, hospital);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<Void> unsubscribe(@RequestBody Map<String, String> body) {
        String endpoint = body.get("endpoint");
        if (endpoint != null) {
            pushService.unsubscribe(endpoint);
        }
        return ResponseEntity.ok().build();
    }
}
