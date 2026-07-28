package com.eventteam.service;
import com.eventteam.entity.Activity;
import com.eventteam.entity.Event;
import com.eventteam.entity.Image;
import com.eventteam.repository.ActivityRepository;
import com.eventteam.repository.EventRepository;
import com.eventteam.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class ImageService {
    private final ImageRepository imageRepository;
    private final ActivityRepository activityRepository;
    private final EventRepository eventRepository;
    public Image findById(Long id) {
        return imageRepository.findById(id).orElseThrow(()->new RuntimeException("Image introuvable avec id :"+id));
    }
    public Image addImageToActivity(Long activityId,Image payload) {
        Activity activity=activityRepository.findById(activityId).orElseThrow(()->new RuntimeException("Activity introuvable avec id :"+activityId));
        payload.setActivity(activity);
        return imageRepository.save(payload);
    }
    public Image addImageToEvent(Long eventId,Image payload) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(()->new RuntimeException("Event introuvable avec id :"+eventId));
        payload.setEvent(event);
        return imageRepository.save(payload);
    }
    public void delete(Long id) {
        Image existing = findById(id);
        imageRepository.delete(existing);
    }
}
