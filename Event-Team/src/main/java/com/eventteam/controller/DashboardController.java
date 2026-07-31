package com.eventteam.controller;

import com.eventteam.dto.DashboardStatsDto;
import com.eventteam.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH')")
    public DashboardStatsDto getStats(Authentication authentication) {
        boolean isRH = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_RESPONSABLE_RH"));
        if (isRH) {
            return dashboardService.getStatsForResponsable(authentication.getName());
        }
        return dashboardService.getStats();
    }
}