package com.eventteam.service;

import com.eventteam.entity.Activity;
import com.eventteam.entity.Employe;
import com.eventteam.entity.Event;
import com.eventteam.entity.ExternalCompany;
import com.eventteam.entity.Image;
import com.eventteam.entity.ResponsableRH;
import com.eventteam.repository.ActivityRepository;
import com.eventteam.repository.EmployeRepository;
import com.eventteam.repository.EventRepository;
import com.eventteam.repository.ExternalCompanyRepository;
import com.eventteam.repository.FeedbackRepository;
import com.eventteam.repository.ImageRepository;
import com.eventteam.repository.ResponsableRHRepository;
import com.eventteam.service.ParticipationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EmployeRepository employeRepository;
    private final ParticipationService participationService;
    private final ActivityRepository activityRepository;
    private final FeedbackRepository feedbackRepository;
    private final ImageRepository imageRepository;
    private final ResponsableRHRepository responsableRHRepository;
    private final ExternalCompanyRepository externalCompanyRepository;

    public List<Event> findAll() {
        return eventRepository.findAll();
    }

    public List<Event> findAllForResponsable(String rhEmail) {
        ResponsableRH rh = responsableRHRepository.findByEmail(rhEmail)
                .orElseThrow(() -> new RuntimeException("Responsable RH introuvable"));
        return eventRepository.findByResponsableRH_Id(rh.getId());
    }

    public Event findById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event introuvable avec id: " + id));
    }

    /**
     * Crée un event en forçant son propriétaire (responsableRH ou externalCompany)
     * à partir de l'utilisateur authentifié, plutôt que de faire confiance à ce
     * qui est envoyé dans le payload. Ceci garantit que l'event est toujours
     * rattaché au bon espace RH, même si le frontend oublie de le renseigner
     * (ou si le payload est manipulé). Un ADMIN garde le comportement d'origine
     * (le payload fait foi) puisqu'il agit potentiellement pour le compte d'un tiers.
     */
    public Event create(Event event, String creatorEmail, String creatorRole) {
        if ("RESPONSABLE_RH".equals(creatorRole)) {
            ResponsableRH rh = responsableRHRepository.findByEmail(creatorEmail)
                    .orElseThrow(() -> new RuntimeException("Responsable RH introuvable"));
            event.setResponsableRH(rh);
        } else if ("EXTERNAL_COMPANY".equals(creatorRole)) {
            ExternalCompany company = externalCompanyRepository.findByEmail(creatorEmail)
                    .orElseThrow(() -> new RuntimeException("Entreprise externe introuvable"));
            event.setExternalCompany(company);
        }
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
        deleteCascade(existing);
    }

    /**
     * Supprime un event et tout ce qui en dépend, dans le bon ordre pour éviter
     * les violations de contrainte de clé étrangère :
     * images d'activités -> activités -> images d'event -> feedbacks -> event
     * (les participations sont supprimées automatiquement car Event a
     * cascade=ALL, orphanRemoval=true sur son Set<Participation>).
     */
    @Transactional
    public void deleteCascade(Event event) {
        List<Activity> activities = activityRepository.findByEvent_Id(event.getId());
        for (Activity activity : activities) {
            List<Image> activityImages = imageRepository.findByActivity_Id(activity.getId());
            imageRepository.deleteAll(activityImages);
        }
        activityRepository.deleteAll(activities);

        List<Image> eventImages = imageRepository.findByEvent_Id(event.getId());
        imageRepository.deleteAll(eventImages);

        feedbackRepository.deleteAll(feedbackRepository.findByEvent_Id(event.getId()));

        eventRepository.delete(event);
    }

    @Transactional
    public void deleteAllByResponsableRH(Long responsableRhId) {
        List<Event> events = eventRepository.findByResponsableRH_Id(responsableRhId);
        for (Event event : events) {
            deleteCascade(event);
        }
    }

    @Transactional
    public void deleteAllByExternalCompany(Long externalCompanyId) {
        List<Event> events = eventRepository.findByExternalCompany_Id(externalCompanyId);
        for (Event event : events) {
            deleteCascade(event);
        }
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