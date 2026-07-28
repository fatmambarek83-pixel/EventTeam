package com.eventteam.controller;
import com.eventteam.entity.ExternalCompany;
import com.eventteam.service.ExternalCompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/external-companies")
@RequiredArgsConstructor
public class ExternalCompanyController {
    private final ExternalCompanyService externalCompanyService;

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
}