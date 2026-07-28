package com.eventteam.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
public class DashboardStatsDto {
    private long totalEvents;
    private String totalEventsDelta;
    private long activeActivities;
    private long activeActivitiesTotal;
    private long totalParticipants;
    private double averageRating;
}