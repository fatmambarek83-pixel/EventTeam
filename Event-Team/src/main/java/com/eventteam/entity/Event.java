package com.eventteam.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.HashSet;
import java.util.Set;
import java.util.Date;
import java.util.UUID;
@Builder
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name ="event")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Builder.Default
    @Column(unique = true, updatable = false)
    private UUID uuid= UUID.randomUUID();
    @NotBlank(message = "Le nom de l'evenemt est obligatoire")
    private String name;
    private Date startDate;
    private Date endDate;
    private String category;
    private String creator;
    private Integer capacity;
    private String status;
    private String location;
    @ManyToOne
    @JoinColumn(name = "responsable_rh_id")
    private ResponsableRH responsableRH;
    @ManyToOne
    @JoinColumn(name = "external_company_id")
    private ExternalCompany externalCompany;
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private Set<Participation> participations = new HashSet<>();

    public int getParticipantsCount() {
        return (int) participations.stream()
                .filter(p -> p.getStatus() == ParticipationStatus.EN_ATTENTE
                        || p.getStatus() == ParticipationStatus.ACCEPTEE)
                .count();
    }
}