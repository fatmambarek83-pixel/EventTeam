package com.eventteam.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Builder
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="employe")
public class Employe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Builder.Default
    @Column(unique = true,updatable = false)
    private UUID uuid = UUID.randomUUID();
    @NotBlank(message="le nom est obligatoire")
    private String name;
    @Email(message = "Email invalide")
    @Column(unique = true,nullable = false)
    private String email;
    @Size(min=6,message="Le mot de passe doit contenir au moins 6 caracteres")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    @Builder.Default
    private String role="EMPLOYE";
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AccountStatus status = AccountStatus.PENDING;
    private String image;
    private String poste;
    private String departement;
    @Column(columnDefinition="TEXT")
    private String photo;
    @OneToMany(mappedBy = "employe", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private Set<Participation> participations = new HashSet<>();
}