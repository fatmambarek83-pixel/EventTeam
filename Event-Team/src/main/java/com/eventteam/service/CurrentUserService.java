package com.eventteam.service;

import com.eventteam.repository.EmployeRepository;
import com.eventteam.repository.ExternalCompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserService {

    private final EmployeRepository employeRepository;
    private final ExternalCompanyRepository externalCompanyRepository;

    public Long getCurrentEmployeId(Authentication authentication) {
        String email = authentication.getName();
        return employeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employe introuvable pour: " + email))
                .getId();
    }

    public Long getCurrentExternalCompanyId(Authentication authentication) {
        String email = authentication.getName();
        return externalCompanyRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Entreprise introuvable pour: " + email))
                .getId();
    }

    public boolean isAdminOrRh(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                        || a.getAuthority().equals("ROLE_RESPONSABLE_RH"));
    }
}