package com.eventteam.entity;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;
@Builder
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="responsable_rh")
public class ResponsableRH {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    @Column(unique = true, updatable = false)
    private UUID uuid = UUID.randomUUID();

    private String name;

    @Column(unique = true, nullable = false)
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Builder.Default
    private String role = "RESPONSABLE_RH";
    private String departement;
    @Column(columnDefinition="TEXT")
    private String photo;
}