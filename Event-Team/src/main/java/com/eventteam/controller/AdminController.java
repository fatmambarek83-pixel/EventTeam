package com.eventteam.controller;

import com.eventteam.dto.CreateRHRequest;
import com.eventteam.dto.UpdateProfileRequest;
import com.eventteam.entity.Admin;
import com.eventteam.entity.ResponsableRH;
import com.eventteam.repository.AdminRepository;
import com.eventteam.service.EmailService;
import com.eventteam.service.ResponsableRHService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);
    private final ResponsableRHService responsableRHService;
    private final EmailService emailService;
    private final AdminRepository adminRepository;

    @PostMapping("/rh")
    public Map<String, String> createRH(@RequestBody CreateRHRequest request) {
        String[] result = responsableRHService.createByAdmin(request.getName(), request.getEmail(), request.getPassword());
        String email = result[0];
        String rawPassword = result[1];

        try {
            emailService.sendRHCredentials(email, request.getName(), rawPassword);
            return Map.of(
                    "message", "Compte RH créé, les identifiants ont été envoyés par email.",
                    "email", email
            );
        } catch (Exception e) {
            log.error("Echec de l'envoi de l'email de credentials RH pour {} : {}", email, e.getMessage());
        }

        return Map.of(
                "message", "Compte RH créé, mais l'envoi de l'email a échoué. "
                        + "Merci de transmettre les identifiants manuellement.",
                "email", email,
                "password", rawPassword
        );
    }

    @GetMapping("/rh")
    public List<ResponsableRH> listRH() {
        return responsableRHService.findAll();
    }

    @DeleteMapping("/rh/{id}")
    public void deleteRH(@PathVariable Long id) {
        responsableRHService.delete(id);
    }

    @GetMapping("/profile")
    public Admin getProfile(Authentication authentication) {
        return adminRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Administrateur introuvable"));
    }

    @PutMapping("/profile")
    public Admin updateProfile(Authentication authentication, @RequestBody UpdateProfileRequest request) {
        Admin admin = adminRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Administrateur introuvable"));

        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPhone(request.getPhone());
        admin.setPosition(request.getPosition());
        return adminRepository.save(admin);
    }
}