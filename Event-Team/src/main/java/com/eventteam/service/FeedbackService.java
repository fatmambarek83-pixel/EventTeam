package com.eventteam.service;

import com.eventteam.entity.Employe;
import com.eventteam.entity.Event;
import com.eventteam.entity.Feedback;
import com.eventteam.repository.EmployeRepository;
import com.eventteam.repository.EventRepository;
import com.eventteam.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final EventRepository eventRepository;
    private final EmployeRepository employeRepository;

    public List<Feedback> findAll() {
        return feedbackRepository.findAll();
    }

    public List<Feedback> findByEvent(Long eventId) {
        return feedbackRepository.findByEvent_Id(eventId);
    }

    public Feedback findById(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback introuvable avec id: " + id));
    }
    public Feedback addFeedback(Long eventId, Long employeId, Feedback payload) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event introuvable avec id: " + eventId));
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new RuntimeException("Employe introuvable avec id: " + employeId));

        payload.setEvent(event);
        payload.setAuteur(employe);
        return feedbackRepository.save(payload);
    }

    public void delete(Long id) {
        Feedback existing = findById(id);
        feedbackRepository.delete(existing);
    }
}