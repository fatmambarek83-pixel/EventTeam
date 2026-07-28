package com.eventteam.security;

import com.eventteam.repository.AdminRepository;
import com.eventteam.repository.EmployeRepository;
import com.eventteam.repository.ResponsableRHRepository;
import com.eventteam.repository.ExternalCompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final EmployeRepository employeRepository;
    private final ResponsableRHRepository responsableRepository;
    private final ExternalCompanyRepository externalCompanyRepository;
    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Check Admin
        var admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return new User(admin.get().getEmail(), admin.get().getPassword(),
                    true, true, true, true,
                    List.of(new SimpleGrantedAuthority("ROLE_" + admin.get().getRole())));
        }

        // 2. Check Responsable RH
        var rh = responsableRepository.findByEmail(email);
        if (rh.isPresent()) {
            return new User(rh.get().getEmail(), rh.get().getPassword(),
                    true, true, true, true,
                    List.of(new SimpleGrantedAuthority("ROLE_RESPONSABLE_RH")));
        }

        // 3. Check Employé
        var employe = employeRepository.findByEmail(email);
        if (employe.isPresent()) {
            boolean enabled = employe.get().getStatus() == com.eventteam.entity.AccountStatus.APPROVED;
            return new User(employe.get().getEmail(), employe.get().getPassword(),
                    enabled, true, true, true,
                    List.of(new SimpleGrantedAuthority("ROLE_EMPLOYE")));
        }

        // 4. Check External Company
        var company = externalCompanyRepository.findByEmail(email);
        if (company.isPresent()) {
            boolean enabled = company.get().getStatus() == com.eventteam.entity.AccountStatus.APPROVED;
            return new User(company.get().getEmail(), company.get().getPassword(),
                    enabled, true, true, true,
                    List.of(new SimpleGrantedAuthority("ROLE_EXTERNAL_COMPANY")));
        }

        throw new UsernameNotFoundException("Utilisateur introuvable avec email: " + email);
    }
}