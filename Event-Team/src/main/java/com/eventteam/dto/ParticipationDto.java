package com.eventteam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ParticipationDto {
    private Long id;
    private Long employeId;
    private String participantName;
    private String participantDepartment;
    private String avatarInitials;
    private Long eventId;
    private String eventName;
    private String eventLocation;
    private String date;
    private String status;
}