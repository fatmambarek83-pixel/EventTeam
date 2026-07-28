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
@Table(name="image")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Builder.Default
    @Column(unique = true,updatable = false)
    private UUID uuid = UUID.randomUUID();
    private String extension;
    private String path;
    @ManyToOne
    @JoinColumn(name="activity_id")
    @JsonIgnore
    private Activity activity;
    @OneToOne
    @JoinColumn(name="event_id")
    @JsonIgnore
    private Event event;
}