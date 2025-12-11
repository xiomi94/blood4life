package com.xiojuandawt.blood4life.controllers;

import com.xiojuandawt.blood4life.dto.CampaignDTO;
import com.xiojuandawt.blood4life.entities.Campaign;
import com.xiojuandawt.blood4life.entities.Hospital;
import com.xiojuandawt.blood4life.services.CampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/campaign")
public class CampaignController {

    @Autowired
    private CampaignService campaignService;

    @PostMapping
    public ResponseEntity<?> createCampaign(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("location") String location,
            @RequestParam("requiredDonorQuantity") Integer requiredDonorQuantity,
            @RequestParam("requiredBloodTypes") List<String> requiredBloodTypes,
            Authentication authentication) {

        try {
            // Get authenticated hospital
            Hospital hospital = (Hospital) authentication.getPrincipal();

            // Parse dates
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);

            // Validate dates
            if (end.isBefore(start)) {
                Map<String, String> body = new HashMap<>();
                body.put("error", "La fecha de fin debe ser posterior o igual a la fecha de inicio");
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(body);
            }

            // Validate donor quantity
            if (requiredDonorQuantity == null || requiredDonorQuantity <= 0) {
                Map<String, String> body = new HashMap<>();
                body.put("error", "La cantidad de donantes debe ser mayor a 0");
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(body);
            }

            // Validate blood types
            if (requiredBloodTypes == null || requiredBloodTypes.isEmpty()) {
                Map<String, String> body = new HashMap<>();
                body.put("error", "Debe seleccionar al menos un tipo de sangre");
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(body);
            }

            // Create campaign
            Campaign campaign = new Campaign();
            campaign.setHospital(hospital);
            campaign.setName(name);
            campaign.setDescription(description);
            campaign.setStartDate(start);
            campaign.setEndDate(end);
            campaign.setLocation(location);
            campaign.setRequiredDonorQuantity(requiredDonorQuantity);

            // Save campaign with blood types
            CampaignDTO createdCampaign = campaignService.createCampaign(campaign, requiredBloodTypes);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(createdCampaign);

        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            Map<String, String> body = new HashMap<>();
            body.put("error", "Error de base de datos: Verifica que todos los datos sean válidos");
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(body);
        } catch (java.time.format.DateTimeParseException e) {
            Map<String, String> body = new HashMap<>();
            body.put("error", "Formato de fecha inválido. Use el formato AAAA-MM-DD");
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(body);
        } catch (ClassCastException e) {
            Map<String, String> body = new HashMap<>();
            body.put("error", "Usuario no autorizado. Solo hospitales pueden crear campañas");
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(body);
        } catch (Exception e) {
            // Log the actual error for debugging
            System.err.println("Error creating campaign: " + e.getClass().getName() + ": " + e.getMessage());
            e.printStackTrace();

            Map<String, String> body = new HashMap<>();
            body.put("error", "No se pudo crear la campaña. Por favor, verifica todos los campos e intenta de nuevo");
            body.put("details", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(body);
        }
    }

    @GetMapping
    public ResponseEntity<List<CampaignDTO>> getAllCampaigns() {
        List<CampaignDTO> campaigns = campaignService.findAll();
        return ResponseEntity.ok(campaigns);
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<CampaignDTO>> getCampaignsByHospital(@PathVariable Integer hospitalId) {
        List<CampaignDTO> campaigns = campaignService.findByHospitalId(hospitalId);
        return ResponseEntity.ok(campaigns);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCampaignById(@PathVariable Integer id) {
        return campaignService.findById(id)
                .map(campaign -> ResponseEntity.ok(campaignService.parseEntityToDTO(campaign)))
                .orElse(ResponseEntity.notFound().build());
    }
}
