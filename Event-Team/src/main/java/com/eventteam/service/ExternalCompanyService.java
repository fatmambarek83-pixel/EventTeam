package com.eventteam.service;

import com.eventteam.entity.AccountStatus;
import com.eventteam.entity.ExternalCompany;
import com.eventteam.repository.ExternalCompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExternalCompanyService {

    private final ExternalCompanyRepository externalCompanyRepository;
    private final PasswordEncoder passwordEncoder;

    public List<ExternalCompany> findAll() {
        return externalCompanyRepository.findAll();
    }

    public ExternalCompany findById(Long id) {
        return externalCompanyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entreprise externe introuvable avec id: " + id));
    }

    public ExternalCompany create(ExternalCompany payload) {
        if (externalCompanyRepository.existsByEmail(payload.getEmail())) {
            throw new IllegalArgumentException("Une entreprise avec cet email existe déjà");
        }
        payload.setPassword(passwordEncoder.encode(payload.getPassword()));
        payload.setStatus(AccountStatus.PENDING);
        return externalCompanyRepository.save(payload);
    }

    public ExternalCompany update(Long id, ExternalCompany payload) {
        ExternalCompany existing = findById(id);
        existing.setName(payload.getName());
        existing.setEmail(payload.getEmail());
        existing.setContactName(payload.getContactName());
        existing.setPhone(payload.getPhone());
        return externalCompanyRepository.save(existing);
    }

    public void delete(Long id) {
        ExternalCompany existing = findById(id);
        externalCompanyRepository.delete(existing);
    }

    public List<ExternalCompany> findPending() {
        return externalCompanyRepository.findAllByStatus(AccountStatus.PENDING);
    }

    public ExternalCompany validate(Long id) {
        ExternalCompany existing = findById(id);
        existing.setStatus(AccountStatus.APPROVED);
        return externalCompanyRepository.save(existing);
    }

    public ExternalCompany reject(Long id) {
        ExternalCompany existing = findById(id);
        existing.setStatus(AccountStatus.REJECTED);
        return externalCompanyRepository.save(existing);
    }
}