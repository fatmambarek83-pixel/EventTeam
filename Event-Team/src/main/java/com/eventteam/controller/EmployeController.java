package com.eventteam.controller;
import com.eventteam.entity.Employe;
import com.eventteam.service.EmployeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/employes")
@RequiredArgsConstructor
public class EmployeController {
    private final EmployeService employeService;

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
}