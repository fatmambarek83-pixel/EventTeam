package com.eventteam.controller;

import com.eventteam.dto.ChangePasswordRequest;
import com.eventteam.entity.ResponsableRH;
import com.eventteam.repository.ResponsableRHRepository;
import com.eventteam.service.ResponsableRHService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/responsables-rh")
@RequiredArgsConstructor
public class ResponsableRHController {
    private final ResponsableRHService responsableRHService;
    private final ResponsableRHRepository responsableRHRepository;

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

    @GetMapping("/profile")
    @PreAuthorize("hasRole('RESPONSABLE_RH')")
    public ResponsableRH getProfile(Authentication authentication) {
        return responsableRHRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Responsable RH introuvable"));
    }

    @PutMapping("/profile/photo")
    @PreAuthorize("hasRole('RESPONSABLE_RH')")
    public ResponsableRH updatePhoto(Authentication authentication, @RequestBody Map<String, String> body) {
        ResponsableRH rh = responsableRHRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Responsable RH introuvable"));
        rh.setPhoto(body.get("photo"));
        return responsableRHRepository.save(rh);
    }

    @DeleteMapping("/profile/photo")
    @PreAuthorize("hasRole('RESPONSABLE_RH')")
    public ResponsableRH deletePhoto(Authentication authentication) {
        ResponsableRH rh = responsableRHRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Responsable RH introuvable"));
        rh.setPhoto(null);
        return responsableRHRepository.save(rh);
    }
}