package com.eventteam.service;
import com.eventteam.entity.Activity;
import com.eventteam.entity.Event;
import com.eventteam.entity.Image;
import com.eventteam.repository.ActivityRepository;
import com.eventteam.repository.EventRepository;
import com.eventteam.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    /** Toutes les images liées à une activité (la plus récente en premier). */
    public List<Image> getByActivity(Long activityId) {
        List<Image> images = imageRepository.findByActivity_Id(activityId);
        images.sort(Comparator.comparing(Image::getId, Comparator.nullsLast(Comparator.reverseOrder())));
        return images;
    }

    /** L'image (unique) associée à un événement, ou null si aucune. */
    public Image getByEvent(Long eventId) {
        return imageRepository.findFirstByEvent_IdOrderByIdDesc(eventId).orElse(null);
    }

    /** Map eventId -> path pour tous les événements qui ont une image. */
    public Map<Long, String> getAllEventImagePaths() {
        Map<Long, String> result = new HashMap<>();
        for (Image image : imageRepository.findByEventIsNotNull()) {
            if (image.getEvent() != null) {
                result.put(image.getEvent().getId(), image.getPath());
            }
        }
        return result;
    }

    /** Map activityId -> path (première image trouvée) pour toutes les activités qui ont une image. */
    public Map<Long, String> getAllActivityImagePaths() {
        Map<Long, String> result = new HashMap<>();
        for (Image image : imageRepository.findByActivityIsNotNull()) {
            if (image.getActivity() != null) {
                result.putIfAbsent(image.getActivity().getId(), image.getPath());
            }
        }
        return result;
    }
}