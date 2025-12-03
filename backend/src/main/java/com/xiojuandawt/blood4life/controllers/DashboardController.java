package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.entities.BloodDonor;
import com.xiojuandawt.blood4life.entities.Hospital;
import com.xiojuandawt.blood4life.repositories.BloodDonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/dashboard")
public class DashboardController {

  @Autowired
  private BloodDonorRepository bloodDonorRepository;

  @GetMapping
  public String getDashboard(Model model, Authentication authentication) {

    // Detect user type from authentication principal
    Object principal = authentication.getPrincipal();
    String userType = "unknown";
    String userName = "Usuario";

    if (principal instanceof BloodDonor) {
      BloodDonor donor = (BloodDonor) principal;
      userType = "bloodDonor";
      userName = donor.getFirstName() + " " + donor.getLastName();
    } else if (principal instanceof Hospital) {
      Hospital hospital = (Hospital) principal;
      userType = "hospital";
      userName = hospital.getName();
    }

    // Get statistics (same for both user types for now)
    List<Object[]> bloodTypeStats = bloodDonorRepository.countDonorsByBloodType();
    List<Object[]> genderStats = bloodDonorRepository.countDonorsByGender();

    // Add attributes to model
    model.addAttribute("userType", userType);
    model.addAttribute("userName", userName);
    model.addAttribute("bloodTypeLabels", getLabels(bloodTypeStats));
    model.addAttribute("bloodTypeCounts", getCounts(bloodTypeStats));
    model.addAttribute("genderLabels", getLabels(genderStats));
    model.addAttribute("genderCounts", getCounts(genderStats));

    // Return the same template for both user types (mixed template)
    return "bloodDonorDashboard";
  }

  private List<String> getLabels(List<Object[]> stats) {
    List<String> labels = new ArrayList<>();
    for (Object[] row : stats) {
      labels.add((String) row[0]);
    }
    return labels;
  }

  private List<Long> getCounts(List<Object[]> stats) {
    List<Long> counts = new ArrayList<>();
    for (Object[] row : stats) {
      counts.add((Long) row[1]);
    }
    return counts;
  }

}
