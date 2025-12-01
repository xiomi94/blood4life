package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.repositories.BloodDonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardRestController {

        @Autowired
        private BloodDonorRepository bloodDonorRepository;

        @GetMapping("/stats")
        public ResponseEntity<Map<String, Object>> getDashboardStats() {
                // Fetch stats
                List<Object[]> bloodTypeStats = bloodDonorRepository.countDonorsByBloodType();
                List<Object[]> genderStats = bloodDonorRepository.countDonorsByGender();

                // Prepare data for JSON response
                // Blood Type Data
                List<String> bloodTypeLabels = bloodTypeStats.stream()
                                .map(obj -> (String) obj[0])
                                .collect(Collectors.toList());
                List<Long> bloodTypeCounts = bloodTypeStats.stream()
                                .map(obj -> (Long) obj[1])
                                .collect(Collectors.toList());

                // Gender Data
                List<String> genderLabels = genderStats.stream()
                                .map(obj -> (String) obj[0])
                                .collect(Collectors.toList());
                List<Long> genderCounts = genderStats.stream()
                                .map(obj -> (Long) obj[1])
                                .collect(Collectors.toList());

                // Build response
                Map<String, Object> response = new HashMap<>();

                Map<String, Object> bloodTypeData = new HashMap<>();
                bloodTypeData.put("labels", bloodTypeLabels);
                bloodTypeData.put("counts", bloodTypeCounts);

                Map<String, Object> genderData = new HashMap<>();
                genderData.put("labels", genderLabels);
                genderData.put("counts", genderCounts);

                response.put("bloodType", bloodTypeData);
                response.put("gender", genderData);

                return ResponseEntity.ok(response);
        }
}
