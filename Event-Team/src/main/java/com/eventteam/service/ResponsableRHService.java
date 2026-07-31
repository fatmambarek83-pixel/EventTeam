package com.eventteam.service;

import com.eventteam.entity.ResponsableRH;
import com.eventteam.repository.ResponsableRHRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResponsableRHService {

    private final ResponsableRHRepository responsableRHRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmployeService employeService;
    private final ExternalCompanyService externalCompanyService;
    private final EventService eventService;

    public List<ResponsableRH> findAll() {
        return responsableRHRepository.findAll();
    }

    public ResponsableRH findById(Long id) {
        return responsableRHRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Responsable RH introuvable"));
    }

    public ResponsableRH update(Long id, ResponsableRH payload) {
        ResponsableRH existing = findById(id);
        existing.setName(payload.getName());
        existing.setEmail(payload.getEmail());
        existing.setDepartement(payload.getDepartement());
        return responsableRHRepository.save(existing);
    }

    public void changePassword(String email, String currentPassword, String newPassword) {
        ResponsableRH rh = responsableRHRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Responsable RH introuvable"));

        if (!passwordEncoder.matches(currentPassword, rh.getPassword())) {
            throw new RuntimeException("Mot de passe actuel incorrect");
        }

        rh.setPassword(passwordEncoder.encode(newPassword));
        responsableRHRepository.save(rh);
    }

    /**
     * Supprime définitivement le RH ainsi que tout ce qui lui est rattaché :
     * 1. les events qu'il organise directement (+ activités, images, feedbacks, participations)
     * 2. les external companies qu'il a validées (+ leurs events organisés, + leurs participations)
     * 3. les employés qu'il a validés (+ leurs feedbacks, + leurs participations)
     * Ordre important pour éviter les violations de contrainte de clé étrangère.
     */
    @Transactional
    public void delete(Long id) {
        eventService.deleteAllByResponsableRH(id);
        externalCompanyService.deleteAllValidatedBy(id);
        employeService.deleteAllValidatedBy(id);
        responsableRHRepository.deleteById(id);
    }

    public String[] createByAdmin(String name, String email, String password) {
        String rawPassword = (password != null && !password.isBlank())
                ? password
                : UUID.randomUUID().toString().substring(0, 8);

        ResponsableRH rh = new ResponsableRH();
        rh.setName(name);
        rh.setEmail(email);
        rh.setPassword(passwordEncoder.encode(rawPassword));
        rh.setRole("RESPONSABLE_RH");
        responsableRHRepository.save(rh);

        return new String[] { email, rawPassword };
    }
}