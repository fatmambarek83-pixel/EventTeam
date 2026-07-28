package com.eventteam.service;

import com.eventteam.entity.Activity;
import com.eventteam.entity.Event;
import com.eventteam.repository.ActivityRepository;
import com.eventteam.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final EventRepository eventRepository;

    public List<Activity> findAll() {
        return activityRepository.findAll();
    }

    public List<Activity> findByEvent(Long eventId) {
        return activityRepository.findByEvent_Id(eventId);
    }

    public Activity findById(Long id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity introuvable avec id: " + id));
    }

    public Activity addActivity(Long eventId, Activity payload) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event introuvable avec id: " + eventId));
        payload.setEvent(event);
        return activityRepository.save(payload);
    }

    public Activity updateActivity(Long id, Activity payload) {
        Activity existing = findById(id);
        existing.setName(payload.getName());
        existing.setStartDate(payload.getStartDate());
        existing.setEndDate(payload.getEndDate());
        existing.setDescription(payload.getDescription());
        existing.setAnimateur(payload.getAnimateur());
        existing.setStatus(payload.getStatus());
        return activityRepository.save(existing);
    }

    public void deleteActivity(Long id) {
        Activity existing = findById(id);
        activityRepository.delete(existing);
    }
}