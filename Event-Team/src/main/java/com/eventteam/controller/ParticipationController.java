package com.eventteam.controller;

import com.eventteam.dto.ParticipationDto;
import com.eventteam.dto.UpdateParticipationStatusRequest;
import com.eventteam.entity.Event;
import com.eventteam.service.EventService;
import com.eventteam.service.ParticipationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participations")
@RequiredArgsConstructor
public class ParticipationController {

    private final ParticipationService participationService;
    private final EventService eventService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH')")
    public List<ParticipationDto> getAll() {
        return participationService.findAll();
    }

    @GetMapping("/employe/{employeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH', 'EMPLOYE')")
    public List<ParticipationDto> getByEmploye(@PathVariable Long employeId) {
        return participationService.findByEmploye(employeId);
    }

    @GetMapping("/external/{externalCompanyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH', 'EXTERNAL_COMPANY')")
    public List<ParticipationDto> getByExternalCompany(@PathVariable Long externalCompanyId) {
        return participationService.findByExternalCompany(externalCompanyId);
    }

    @PostMapping("/event/{eventId}/employe/{employeId}")
    @PreAuthorize("hasAnyRole('EMPLOYE', 'ADMIN')")
    public Event participer(@PathVariable Long eventId, @PathVariable Long employeId) {
        return eventService.participer(eventId, employeId);
    }

    @DeleteMapping("/event/{eventId}/employe/{employeId}")
    @PreAuthorize("hasAnyRole('EMPLOYE', 'ADMIN')")
    public Event annuler(@PathVariable Long eventId, @PathVariable Long employeId) {
        return eventService.annulerParticipation(eventId, employeId);
    }

    @PostMapping("/event/{eventId}/external/{externalCompanyId}")
    @PreAuthorize("hasAnyRole('EXTERNAL_COMPANY', 'ADMIN')")
    public Event participerExternal(@PathVariable Long eventId, @PathVariable Long externalCompanyId) {
        participationService.participerExternal(eventId, externalCompanyId);
        return eventService.findById(eventId);
    }

    @DeleteMapping("/event/{eventId}/external/{externalCompanyId}")
    @PreAuthorize("hasAnyRole('EXTERNAL_COMPANY', 'ADMIN')")
    public Event annulerExternal(@PathVariable Long eventId, @PathVariable Long externalCompanyId) {
        participationService.annulerExternal(eventId, externalCompanyId);
        return eventService.findById(eventId);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH')")
    public ParticipationDto updateStatus(@PathVariable Long id, @RequestBody UpdateParticipationStatusRequest request) {
        return participationService.updateStatus(id, participationService.fromFrenchLabel(request.getStatus()));
    }
}