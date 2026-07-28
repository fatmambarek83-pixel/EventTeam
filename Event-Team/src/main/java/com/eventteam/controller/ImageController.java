package com.eventteam.controller;
import com.eventteam.entity.Image;
import com.eventteam.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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