package com.eventteam.controller;

import com.eventteam.dto.AuthResponse;
import com.eventteam.dto.ForgotPasswordRequest;
import com.eventteam.dto.LoginRequest;
import com.eventteam.dto.ResetPasswordRequest;
import com.eventteam.entity.PasswordResetToken;
import com.eventteam.repository.AdminRepository;
import com.eventteam.repository.EmployeRepository;
import com.eventteam.repository.ExternalCompanyRepository;
import com.eventteam.repository.PasswordResetTokenRepository;
import com.eventteam.repository.ResponsableRHRepository;
import com.eventteam.security.JwtUtil;
import com.eventteam.service.EmailService;
import com.eventteam.service.RateLimiterService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final AdminRepository adminRepository;
    private final EmployeRepository employeRepository;
    private final ExternalCompanyRepository externalCompanyRepository;
    private final ResponsableRHRepository responsableRHRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final RateLimiterService rateLimiterService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        var admin = adminRepository.findByEmail(request.getEmail());
        if (admin.isPresent()) {
            var a = admin.get();
            String token = jwtUtil.generateToken(a.getEmail(), a.getRole());
            return new AuthResponse(token, a.getId(), a.getEmail(), a.getRole(), a.getName());
        }

        var employe = employeRepository.findByEmail(request.getEmail());
        if (employe.isPresent()) {
            var e = employe.get();
            String token = jwtUtil.generateToken(e.getEmail(), e.getRole());
            return new AuthResponse(token, e.getId(), e.getEmail(), e.getRole(), e.getName());
        }

        var rh = responsableRHRepository.findByEmail(request.getEmail());
        if (rh.isPresent()) {
            var r = rh.get();
            String token = jwtUtil.generateToken(r.getEmail(), r.getRole());
            return new AuthResponse(token, r.getId(), r.getEmail(), r.getRole(), r.getName());
        }

        var company = externalCompanyRepository.findByEmail(request.getEmail());
        if (company.isPresent()) {
            var c = company.get();
            String token = jwtUtil.generateToken(c.getEmail(), c.getRole());
            return new AuthResponse(token, c.getId(), c.getEmail(), c.getRole(), c.getName());
        }
        throw new RuntimeException("Compte introuvable après authentification pour: " + request.getEmail());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String email = request.getEmail();

        if (!rateLimiterService.isAllowed("forgot-password:" + email.toLowerCase())) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("message", "Trop de demandes pour cet email. Veuillez réessayer dans quelques minutes."));
        }

        String name = null;

        var admin = adminRepository.findByEmail(email);
        var employe = employeRepository.findByEmail(email);
        var rh = responsableRHRepository.findByEmail(email);
        var company = externalCompanyRepository.findByEmail(email);

        if (admin.isPresent()) name = admin.get().getName();
        else if (employe.isPresent()) name = employe.get().getName();
        else if (rh.isPresent()) name = rh.get().getName();
        else if (company.isPresent()) name = company.get().getName();

        String genericMessage = "Si un compte existe avec cet email, un lien de réinitialisation vient de lui être envoyé.";

        if (name != null || admin.isPresent() || employe.isPresent() || rh.isPresent() || company.isPresent()) {
            passwordResetTokenRepository.deleteByEmail(email);

            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .token(token)
                    .email(email)
                    .expiryDate(LocalDateTime.now().plusHours(1))
                    .build();
            passwordResetTokenRepository.save(resetToken);

            String resetLink = frontendUrl + "/reset-password/" + token;
            emailService.sendPasswordResetEmail(email, name, resetLink);
        }

        return ResponseEntity.ok(Map.of("message", genericMessage));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        var resetTokenOpt = passwordResetTokenRepository.findByToken(request.getToken());

        if (resetTokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Lien invalide ou expiré."));
        }

        var resetToken = resetTokenOpt.get();
        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            passwordResetTokenRepository.delete(resetToken);
            return ResponseEntity.badRequest().body(Map.of("message", "Lien invalide ou expiré."));
        }

        String email = resetToken.getEmail();
        String encodedPassword = passwordEncoder.encode(request.getNewPassword());

        var admin = adminRepository.findByEmail(email);
        var employe = employeRepository.findByEmail(email);
        var rh = responsableRHRepository.findByEmail(email);
        var company = externalCompanyRepository.findByEmail(email);

        if (admin.isPresent()) {
            var a = admin.get();
            a.setPassword(encodedPassword);
            adminRepository.save(a);
        } else if (employe.isPresent()) {
            var e = employe.get();
            e.setPassword(encodedPassword);
            employeRepository.save(e);
        } else if (rh.isPresent()) {
            var r = rh.get();
            r.setPassword(encodedPassword);
            responsableRHRepository.save(r);
        } else if (company.isPresent()) {
            var c = company.get();
            c.setPassword(encodedPassword);
            externalCompanyRepository.save(c);
        } else {
            passwordResetTokenRepository.delete(resetToken);
            return ResponseEntity.badRequest().body(Map.of("message", "Compte introuvable."));
        }

        passwordResetTokenRepository.delete(resetToken);
        return ResponseEntity.ok(Map.of("message", "Mot de passe réinitialisé avec succès."));
    }
}