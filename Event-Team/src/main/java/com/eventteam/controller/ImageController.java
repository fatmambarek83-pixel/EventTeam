package com.eventteam.controller;
import com.eventteam.entity.Image;
import com.eventteam.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {
    private final ImageService imageService;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH', 'EMPLOYE')")
    public Image getById(@PathVariable Long id) {
        return imageService.findById(id);
    }

    @GetMapping("/activity/{activityId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH', 'EMPLOYE', 'EXTERNAL_COMPANY')")
    public List<Image> getByActivity(@PathVariable Long activityId) {
        return imageService.getByActivity(activityId);
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH', 'EMPLOYE', 'EXTERNAL_COMPANY')")
    public Image getByEvent(@PathVariable Long eventId) {
        return imageService.getByEvent(eventId);
    }

    @GetMapping("/events")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH', 'EMPLOYE', 'EXTERNAL_COMPANY')")
    public Map<Long, String> getAllEventImagePaths() {
        return imageService.getAllEventImagePaths();
    }

    @GetMapping("/activities")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH', 'EMPLOYE', 'EXTERNAL_COMPANY')")
    public Map<Long, String> getAllActivityImagePaths() {
        return imageService.getAllActivityImagePaths();
    }

    @PostMapping("/activity/{activityId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH')")
    public Image addToActivity(@PathVariable Long activityId, @RequestBody Image payload) {
        return imageService.addImageToActivity(activityId, payload);
    }

    @PostMapping("/event/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH')")
    public Image addToEvent(@PathVariable Long eventId, @RequestBody Image payload) {
        return imageService.addImageToEvent(eventId, payload);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_RH')")
    public void delete(@PathVariable Long id) {
        imageService.delete(id);
    }
}