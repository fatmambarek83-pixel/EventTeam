package com.eventteam.controller;
import com.eventteam.entity.ExternalCompany;
import com.eventteam.repository.ExternalCompanyRepository;
import com.eventteam.service.ExternalCompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/external-companies")
@RequiredArgsConstructor
public class ExternalCompanyController {
    private final ExternalCompanyService externalCompanyService;
    private final ExternalCompanyRepository externalCompanyRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH')")
    public List<ExternalCompany> getAll() {
        return externalCompanyService.findAll();
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('RESPONSABLE_RH')")
    public List<ExternalCompany> getPending() {
        return externalCompanyService.findPending();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH', 'EXTERNAL_COMPANY')")
    public ExternalCompany getById(@PathVariable Long id) {
        return externalCompanyService.findById(id);
    }

    @PostMapping
    public ExternalCompany create(@RequestBody ExternalCompany payload) {
        // inscription publique, comme pour Employe.create() -> pas de restriction
        return externalCompanyService.create(payload);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXTERNAL_COMPANY')")
    public ExternalCompany update(@PathVariable Long id, @RequestBody ExternalCompany payload) {
        return externalCompanyService.update(id, payload);
    }

    @PutMapping("/{id}/validate")
    @PreAuthorize("hasRole('RESPONSABLE_RH')")
    public ExternalCompany validate(@PathVariable Long id) {
        return externalCompanyService.validate(id);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('RESPONSABLE_RH')")
    public ExternalCompany reject(@PathVariable Long id) {
        return externalCompanyService.reject(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        externalCompanyService.delete(id);
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('EXTERNAL_COMPANY')")
    public ExternalCompany getProfile(Authentication authentication) {
        return externalCompanyRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Entreprise externe introuvable"));
    }

    @PutMapping("/profile/photo")
    @PreAuthorize("hasRole('EXTERNAL_COMPANY')")
    public ExternalCompany updatePhoto(Authentication authentication, @RequestBody Map<String, String> body) {
        ExternalCompany company = externalCompanyRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Entreprise externe introuvable"));
        company.setPhoto(body.get("photo"));
        return externalCompanyRepository.save(company);
    }

    @DeleteMapping("/profile/photo")
    @PreAuthorize("hasRole('EXTERNAL_COMPANY')")
    public ExternalCompany deletePhoto(Authentication authentication) {
        ExternalCompany company = externalCompanyRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Entreprise externe introuvable"));
        company.setPhoto(null);
        return externalCompanyRepository.save(company);
    }
}