package com.eventteam.controller;

import com.eventteam.dto.ChangePasswordRequest;
import com.eventteam.entity.ResponsableRH;
import com.eventteam.service.ResponsableRHService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/responsables-rh")
@RequiredArgsConstructor
public class ResponsableRHController {
    private final ResponsableRHService responsableRHService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<ResponsableRH> getAll() {
        return responsableRHService.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH')")
    public ResponsableRH getById(@PathVariable Long id) {
        return responsableRHService.findById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH')")
    public ResponsableRH update(@PathVariable Long id, @RequestBody ResponsableRH payload) {
        return responsableRHService.update(id, payload);
    }

    @PutMapping("/change-password")
    @PreAuthorize("hasRole('RESPONSABLE_RH')")
    public void changePassword(Authentication authentication, @RequestBody ChangePasswordRequest request) {
        String email = authentication.getName();
        responsableRHService.changePassword(email, request.getCurrentPassword(), request.getNewPassword());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        responsableRHService.delete(id);
    }
}