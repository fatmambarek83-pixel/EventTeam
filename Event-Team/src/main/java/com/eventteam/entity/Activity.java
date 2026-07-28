package com.eventteam.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;
@Builder
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="activity")
public class Activity {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
     @Builder.Default
    @Column(unique=true,updatable=false)
    private UUID uuid = UUID.randomUUID();
     private  String name;
     private LocalDate startDate ;
     private LocalDate endDate ;
    private String description;
    private String animateur;
    private String status;
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;
}
