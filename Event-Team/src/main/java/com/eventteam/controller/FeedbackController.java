package com.eventteam.controller;

import com.eventteam.entity.Feedback;
import com.eventteam.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH')")
    public List<Feedback> getAll() {
        return feedbackService.findAll();
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH', 'EMPLOYE')")
    public List<Feedback> getByEvent(@PathVariable Long eventId) {
        return feedbackService.findByEvent(eventId);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH')")
    public Feedback getById(@PathVariable Long id) {
        return feedbackService.findById(id);
    }

    @PostMapping("/event/{eventId}/employe/{employeId}")
    @PreAuthorize("hasRole('EMPLOYE')")
    public Feedback create(@PathVariable Long eventId,
                           @PathVariable Long employeId,
                           @RequestBody Feedback payload) {
        return feedbackService.addFeedback(eventId, employeId, payload);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH')")
    public void delete(@PathVariable Long id) {
        feedbackService.delete(id);
    }
}