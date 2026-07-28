package com.eventteam.service;

import com.eventteam.dto.DashboardStatsDto;
import com.eventteam.entity.Feedback;
import com.eventteam.entity.ParticipationStatus;
import com.eventteam.repository.ActivityRepository;
import com.eventteam.repository.EventRepository;
import com.eventteam.repository.FeedbackRepository;
import com.eventteam.repository.ParticipationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EventRepository eventRepository;
    private final ActivityRepository activityRepository;
    private final ParticipationRepository participationRepository;
    private final FeedbackRepository feedbackRepository;

    public DashboardStatsDto getStats() {
        long totalEvents = eventRepository.count();

        LocalDate firstOfMonth = LocalDate.now().withDayOfMonth(1);
        long eventsThisMonth = eventRepository.findAll().stream()
                .filter(e -> e.getStartDate() != null && toLocalDate(e.getStartDate()).isAfter(firstOfMonth.minusDays(1)))
                .count();
        String totalEventsDelta = "+" + eventsThisMonth + " ce mois";

        long activeActivities = activityRepository.findAll().stream()
                .filter(a -> "IN_PROGRESS".equalsIgnoreCase(a.getStatus()))
                .count();
        long activeActivitiesTotal = activityRepository.count();

        long totalParticipants = participationRepository.findAll().stream()
                .filter(p -> p.getStatus() == ParticipationStatus.ACCEPTEE
                        || p.getStatus() == ParticipationStatus.EN_ATTENTE)
                .count();

        double averageRating = feedbackRepository.findAll().stream()
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