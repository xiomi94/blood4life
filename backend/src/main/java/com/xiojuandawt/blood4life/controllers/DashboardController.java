package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.repositories.BloodDonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/dashboard")
public class DashboardController {

  @Autowired
  private BloodDonorRepository bloodDonorRepository;

  @GetMapping
  public String getDashboard(Model model, @RequestParam(required = false) String filter) {
    // Fetch stats
    List<Object[]> bloodTypeStats = bloodDonorRepository.countDonorsByBloodType();
    List<Object[]> genderStats = bloodDonorRepository.countDonorsByGender();

    // Prepare data for Chart.js
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

    model.addAttribute("bloodTypeLabels", bloodTypeLabels);
    model.addAttribute("bloodTypeCounts", bloodTypeCounts);
    model.addAttribute("genderLabels", genderLabels);
    model.addAttribute("genderCounts", genderCounts);

    return "dashboard";
  }
}
