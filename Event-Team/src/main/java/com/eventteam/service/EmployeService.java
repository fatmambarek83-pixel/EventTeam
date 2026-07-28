package com.eventteam.service;

import com.eventteam.entity.AccountStatus;
import com.eventteam.entity.Employe;
import com.eventteam.repository.EmployeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeService {
    private final EmployeRepository employeRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public List<Employe> findAll(){
        return employeRepository.findAll();
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

    public Employe validate(Long id) {
        Employe existing = findById(id);
        existing.setStatus(AccountStatus.APPROVED);
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
}