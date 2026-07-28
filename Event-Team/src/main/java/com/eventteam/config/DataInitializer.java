package com.eventteam.config;
import com.eventteam.entity.Admin;
import com.eventteam.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    @Value("${app.admin.email}")
    private String adminEmail;
    @Value("${app.admin.password}")
    private String adminPassword;
    @Value("${app.admin.name}")
    private String adminName;
    @Override
    public void run(String... args){
        if(!adminRepository.existsByEmail(adminEmail)){
            Admin admin=Admin.builder().name(adminName)
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role("ADMIN")
                    .build();
            adminRepository.save(admin);
            System.out.println("■ Admin seedé : " + adminEmail);;
        }
    }
}
