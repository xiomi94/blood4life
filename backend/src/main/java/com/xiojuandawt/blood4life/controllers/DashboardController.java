package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.repositories.BloodDonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
  public String getDashboard(Model model) {

    List<Object[]> bloodTypeStats = bloodDonorRepository.countDonorsByBloodType();
    List<Object[]> genderStats = bloodDonorRepository.countDonorsByGender();

    model.addAttribute("bloodTypeLabels", getLabels(bloodTypeStats));
    model.addAttribute("bloodTypeCounts", getCounts(bloodTypeStats));
    model.addAttribute("genderLabels", getLabels(genderStats));
    model.addAttribute("genderCounts", getCounts(genderStats));

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
