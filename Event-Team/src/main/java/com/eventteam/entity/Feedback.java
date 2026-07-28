package com.eventteam.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Builder
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="feedback")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    @Column(unique = true, updatable = false)
    private UUID uuid = UUID.randomUUID();

    private String commentaire;
    private String emoji;

    private Integer stars;

    @ManyToOne
    @JoinColumn(name="id_auteur")
    @JsonIgnore
    private Employe auteur;

    @ManyToOne
    @JoinColumn(name="event_id")
    @JsonIgnore
    private Event event;

    public Long getEventId() {
        return event != null ? event.getId() : null;
    }

    public Long getAuteurId() {
        return auteur != null ? auteur.getId() : null;
    }

    public String getAuteurName() {
        return auteur != null ? auteur.getName() : null;
    }
}