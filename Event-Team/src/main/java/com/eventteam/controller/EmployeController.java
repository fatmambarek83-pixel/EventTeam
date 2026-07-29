package com.eventteam.controller;
import com.eventteam.entity.Employe;
import com.eventteam.repository.EmployeRepository;
import com.eventteam.service.EmployeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employes")
@RequiredArgsConstructor
public class EmployeController {
    private final EmployeService employeService;
    private final EmployeRepository employeRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH')")
    public List<Employe> findAll(){
        return employeService.findAll();
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('RESPONSABLE_RH')")
    public List<Employe> findPending(){
        return employeService.findPending();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH', 'EMPLOYE')")
    public Employe getById(@PathVariable Long id){
        return employeService.findById(id);
    }

    @PostMapping
    public Employe create(@Valid @RequestBody Employe payload){
        return employeService.create(payload);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYE')")
    public Employe update(@PathVariable Long id, @RequestBody Employe payload){
        return employeService.update(id, payload);
    }

    @PutMapping("/{id}/validate")
    @PreAuthorize("hasRole('RESPONSABLE_RH')")
    public Employe validate(@PathVariable Long id){
        return employeService.validate(id);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('RESPONSABLE_RH')")
    public Employe reject(@PathVariable Long id){
        return employeService.reject(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id){
        employeService.delete(id);
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('EMPLOYE')")
    public Employe getProfile(Authentication authentication){
        return employeRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));
    }

    @PutMapping("/profile/photo")
    @PreAuthorize("hasRole('EMPLOYE')")
    public Employe updatePhoto(Authentication authentication, @RequestBody Map<String, String> body){
        Employe employe = employeRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));
        employe.setPhoto(body.get("photo"));
        return employeRepository.save(employe);
    }

    @DeleteMapping("/profile/photo")
    @PreAuthorize("hasRole('EMPLOYE')")
    public Employe deletePhoto(Authentication authentication){
        Employe employe = employeRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));
        employe.setPhoto(null);
        return employeRepository.save(employe);
    }
}