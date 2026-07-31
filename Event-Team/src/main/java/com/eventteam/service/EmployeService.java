package com.eventteam.service;

import com.eventteam.entity.AccountStatus;
import com.eventteam.entity.Employe;
import com.eventteam.entity.ResponsableRH;
import com.eventteam.repository.EmployeRepository;
import com.eventteam.repository.FeedbackRepository;
import com.eventteam.repository.ResponsableRHRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeService {
    private final EmployeRepository employeRepository;
    private final ResponsableRHRepository responsableRHRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final FeedbackRepository feedbackRepository;

    public List<Employe> findAll(){
        return employeRepository.findAll();
    }

    public List<Employe> findAllValidatedBy(String rhEmail){
        ResponsableRH rh = responsableRHRepository.findByEmail(rhEmail)
                .orElseThrow(() -> new RuntimeException("Responsable RH introuvable"));
        return employeRepository.findByValidatedBy_Id(rh.getId());
    }

    public List<Employe> findPending(){
        return employeRepository.findAll().stream()
                .filter(e -> e.getStatus() == AccountStatus.PENDING)
                .toList();
    }

    public Employe findById(Long id){
        return employeRepository.findById(id).orElseThrow(()->new RuntimeException("Employe introvable avec id:"+id));
    }

    public Employe create(Employe payload){
        if (employeRepository.existsByEmail(payload.getEmail())) {
            throw new IllegalArgumentException("Un employé avec cet email existe déjà");
        }
        payload.setPassword(passwordEncoder.encode(payload.getPassword()));
        payload.setStatus(AccountStatus.PENDING);
        return employeRepository.save(payload);
    }

    public Employe validate(Long id, String rhEmail) {
        Employe existing = findById(id);
        existing.setStatus(AccountStatus.APPROVED);
        ResponsableRH rh = responsableRHRepository.findByEmail(rhEmail).orElse(null);
        existing.setValidatedBy(rh);
        Employe saved = employeRepository.save(existing);
        emailService.sendAccountValidated(saved.getEmail(), saved.getName());
        return saved;
    }

    public Employe reject(Long id){
        Employe existing = findById(id);
        existing.setStatus(AccountStatus.REJECTED);
        Employe saved = employeRepository.save(existing);
        emailService.sendAccountRejected(saved.getEmail(), saved.getName());
        return saved;
    }

    public Employe update(Long id, Employe payload){
        Employe existing=findById(id);
        existing.setName(payload.getName());
        existing.setImage(payload.getImage());
        return employeRepository.save(existing);
    }

    public void delete(Long id) {
        Employe existing = findById(id);
        employeRepository.delete(existing);
    }

    public void changePassword(String email, String currentPassword, String newPassword) {
        Employe employe = employeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        if (!passwordEncoder.matches(currentPassword, employe.getPassword())) {
            throw new RuntimeException("Mot de passe actuel incorrect");
        }

        employe.setPassword(passwordEncoder.encode(newPassword));
        employeRepository.save(employe);
    }

    /**
     * Supprime définitivement tous les employés validés par ce RH.
     * Leurs feedbacks sont supprimés explicitement (Feedback.auteur n'a pas
     * de cascade côté Employe). Leurs participations sont supprimées
     * automatiquement par JPA car Employe a cascade=ALL, orphanRemoval=true
     * sur son Set<Participation>.
     */
    @Transactional
    public void deleteAllValidatedBy(Long responsableRhId) {
        List<Employe> employes = employeRepository.findByValidatedBy_Id(responsableRhId);
        for (Employe employe : employes) {
            feedbackRepository.deleteAll(feedbackRepository.findByAuteur_Id(employe.getId()));
            employeRepository.delete(employe);
        }
    }
}