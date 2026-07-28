package com.eventteam.service;

import com.eventteam.entity.Employe;
import com.eventteam.entity.Event;
import com.eventteam.repository.EmployeRepository;
import com.eventteam.repository.EventRepository;
import com.eventteam.service.ParticipationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EmployeRepository employeRepository;
    private final ParticipationService participationService;

    public List<Event> findAll() {
        return eventRepository.findAll();
    }

    public Event findById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event introuvable avec id: " + id));
    }

    public Event create(Event event) {
        return eventRepository.save(event);
    }

    public Event update(Long id, Event payload) {
        Event existing = findById(id);
        existing.setName(payload.getName());
        existing.setStartDate(payload.getStartDate());
        existing.setEndDate(payload.getEndDate());
        existing.setCategory(payload.getCategory());
        existing.setCapacity(payload.getCapacity());
        existing.setStatus(payload.getStatus());
        return eventRepository.save(existing);
    }

    public void delete(Long id) {
        Event existing = findById(id);
        eventRepository.delete(existing);
    }
    public Event participer(Long eventId, Long employeId) {
        participationService.participer(eventId, employeId);
        return findById(eventId);
    }
    public Event annulerParticipation(Long eventId, Long employeId) {
        participationService.annuler(eventId, employeId);
        return findById(eventId);
    }
}