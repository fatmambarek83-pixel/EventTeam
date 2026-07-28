package com.eventteam.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "participations", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"employe_id", "event_id"}),
        @UniqueConstraint(columnNames = {"external_company_id", "event_id"})
})
public class Participation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    @Column(unique = true, updatable = false)
    private UUID uuid = UUID.randomUUID();

    @ManyToOne
    @JoinColumn(name = "employe_id")
    @JsonIgnore
    private Employe employe;

    @ManyToOne
    @JoinColumn(name = "external_company_id")
    @JsonIgnore
    private ExternalCompany externalCompany;

    @ManyToOne
    @JoinColumn(name = "event_id")
    @JsonIgnore
    private Event event;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ParticipationStatus status = ParticipationStatus.EN_ATTENTE;

    @Builder.Default
    private LocalDateTime registeredAt = LocalDateTime.now();
}