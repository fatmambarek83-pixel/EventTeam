package com.eventteam.service;

import com.eventteam.entity.AccountStatus;
import com.eventteam.entity.ExternalCompany;
import com.eventteam.entity.ResponsableRH;
import com.eventteam.repository.ExternalCompanyRepository;
import com.eventteam.repository.ParticipationRepository;
import com.eventteam.repository.ResponsableRHRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExternalCompanyService {

    private final ExternalCompanyRepository externalCompanyRepository;
    private final ResponsableRHRepository responsableRHRepository;
    private final PasswordEncoder passwordEncoder;
    private final ParticipationRepository participationRepository;
    private final EventService eventService;

    public List<ExternalCompany> findAll() {
        return externalCompanyRepository.findAll();
    }

    public List<ExternalCompany> findAllValidatedBy(String rhEmail) {
        ResponsableRH rh = responsableRHRepository.findByEmail(rhEmail)
                .orElseThrow(() -> new RuntimeException("Responsable RH introuvable"));
        return externalCompanyRepository.findByValidatedBy_Id(rh.getId());
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

    public ExternalCompany validate(Long id, String rhEmail) {
        ExternalCompany existing = findById(id);
        existing.setStatus(AccountStatus.APPROVED);
        ResponsableRH rh = responsableRHRepository.findByEmail(rhEmail).orElse(null);
        existing.setValidatedBy(rh);
        return externalCompanyRepository.save(existing);
    }

    public ExternalCompany reject(Long id) {
        ExternalCompany existing = findById(id);
        existing.setStatus(AccountStatus.REJECTED);
        return externalCompanyRepository.save(existing);
    }

    public void changePassword(String email, String currentPassword, String newPassword) {
        ExternalCompany company = externalCompanyRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Entreprise externe introuvable"));

        if (!passwordEncoder.matches(currentPassword, company.getPassword())) {
            throw new RuntimeException("Mot de passe actuel incorrect");
        }

        company.setPassword(passwordEncoder.encode(newPassword));
        externalCompanyRepository.save(company);
    }
    /**
     * Supprime définitivement toutes les external companies validées par ce RH,
     * y compris les events qu'elles organisent (avec toutes leurs dépendances :
     * activités, images, feedbacks, participations) et leurs propres
     * participations à d'autres events.
     */
    @Transactional
    public void deleteAllValidatedBy(Long responsableRhId) {
        List<ExternalCompany> companies = externalCompanyRepository.findByValidatedBy_Id(responsableRhId);
        for (ExternalCompany company : companies) {
            eventService.deleteAllByExternalCompany(company.getId());
            participationRepository.deleteAll(participationRepository.findByExternalCompanyId(company.getId()));
            externalCompanyRepository.delete(company);
        }
    }
}