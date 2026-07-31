package com.eventteam.service;

import com.eventteam.dto.DashboardStatsDto;
import com.eventteam.entity.Event;
import com.eventteam.entity.Feedback;
import com.eventteam.entity.ParticipationStatus;
import com.eventteam.entity.ResponsableRH;
import com.eventteam.repository.ActivityRepository;
import com.eventteam.repository.EventRepository;
import com.eventteam.repository.FeedbackRepository;
import com.eventteam.repository.ParticipationRepository;
import com.eventteam.repository.ResponsableRHRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EventRepository eventRepository;
    private final ActivityRepository activityRepository;
    private final ParticipationRepository participationRepository;
    private final FeedbackRepository feedbackRepository;
    private final ResponsableRHRepository responsableRHRepository;

    public DashboardStatsDto getStats() {
        return computeStats(eventRepository.findAll());
    }

    public DashboardStatsDto getStatsForResponsable(String rhEmail) {
        ResponsableRH rh = responsableRHRepository.findByEmail(rhEmail)
                .orElseThrow(() -> new RuntimeException("Responsable RH introuvable"));
        return computeStats(eventRepository.findByResponsableRH_Id(rh.getId()));
    }

    private DashboardStatsDto computeStats(List<Event> events) {
        long totalEvents = events.size();

        LocalDate firstOfMonth = LocalDate.now().withDayOfMonth(1);
        long eventsThisMonth = events.stream()
                .filter(e -> e.getStartDate() != null && toLocalDate(e.getStartDate()).isAfter(firstOfMonth.minusDays(1)))
                .count();
        String totalEventsDelta = "+" + eventsThisMonth + " ce mois";

        long activeActivities = events.stream()
                .flatMap(e -> activityRepository.findByEvent_Id(e.getId()).stream())
                .filter(a -> "IN_PROGRESS".equalsIgnoreCase(a.getStatus()))
                .count();
        long activeActivitiesTotal = events.stream()
                .mapToLong(e -> activityRepository.findByEvent_Id(e.getId()).size())
                .sum();

        long totalParticipants = events.stream()
                .flatMap(e -> participationRepository.findByEvent_Id(e.getId()).stream())
                .filter(p -> p.getStatus() == ParticipationStatus.ACCEPTEE
                        || p.getStatus() == ParticipationStatus.EN_ATTENTE)
                .count();

        double averageRating = events.stream()
                .flatMap(e -> feedbackRepository.findByEvent_Id(e.getId()).stream())
                .map(Feedback::getStars)
                .filter(stars -> stars != null)
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);

        return new DashboardStatsDto(
                totalEvents,
                totalEventsDelta,
                activeActivities,
                activeActivitiesTotal,
                totalParticipants,
                Math.round(averageRating * 10.0) / 10.0
        );
    }

    private LocalDate toLocalDate(Date date) {
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }
}