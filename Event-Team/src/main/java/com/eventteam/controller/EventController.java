package com.eventteam.controller;

import com.eventteam.entity.Event;
import com.eventteam.repository.EventRepository;
import com.eventteam.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final EventRepository eventRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH', 'EMPLOYE', 'EXTERNAL_COMPANY')")
    public List<Event> getAll() {
        return eventService.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH', 'EMPLOYE', 'EXTERNAL_COMPANY')")
    public Event getById(@PathVariable Long id) {
        return eventService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH', 'EMPLOYE', 'EXTERNAL_COMPANY')")
    public Event create(@RequestBody Event event) {
        return eventService.create(event);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH')")
    public Event update(@PathVariable Long id, @RequestBody Event payload) {
        return eventService.update(id, payload);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH')")
    public void delete(@PathVariable Long id) {
        eventService.delete(id);
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH', 'EMPLOYE', 'EXTERNAL_COMPANY')")
    public List<Event> getByCategory(@PathVariable String category) {
        return eventRepository.findByCategory(category);
    }

    @PostMapping("/{eventId}/participer/{employeId}")
    @PreAuthorize("hasAnyRole('EMPLOYE', 'ADMIN')")
    public Event participer(@PathVariable Long eventId, @PathVariable Long employeId) {
        return eventService.participer(eventId, employeId);
    }

    @DeleteMapping("/{eventId}/participer/{employeId}")
    @PreAuthorize("hasAnyRole('EMPLOYE', 'ADMIN')")
    public Event annulerParticipation(@PathVariable Long eventId, @PathVariable Long employeId) {
        return eventService.annulerParticipation(eventId, employeId);
    }
}