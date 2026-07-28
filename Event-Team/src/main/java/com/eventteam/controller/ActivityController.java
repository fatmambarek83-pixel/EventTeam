package com.eventteam.controller;
import com.eventteam.entity.Activity;
import com.eventteam.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {
    private final ActivityService activityService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH', 'EMPLOYE')")
    public List<Activity> getAll() {
        return activityService.findAll();
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH', 'EMPLOYE')")
    public List<Activity> getByEvent(@PathVariable Long eventId) {
        return activityService.findByEvent(eventId);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH', 'EMPLOYE')")
    public Activity getById(@PathVariable Long id) {
        return activityService.findById(id);
    }

    @PostMapping("/event/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH')")
    public Activity create(@PathVariable Long eventId, @RequestBody Activity payload) {
        return activityService.addActivity(eventId, payload);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH')")
    public Activity update(@PathVariable Long id, @RequestBody Activity payload) {
        return activityService.updateActivity(id, payload);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH')")
    public void delete(@PathVariable Long id) {
        activityService.deleteActivity(id);
    }
}