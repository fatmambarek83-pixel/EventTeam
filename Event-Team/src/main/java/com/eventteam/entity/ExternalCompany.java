package com.eventteam.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
@Builder
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="external_company")
public class ExternalCompany {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Builder.Default
    @Column(unique = true,updatable = false)
    private UUID uuid = UUID.randomUUID();
    private String name;
    @Column(unique = true,nullable = false )
    @Email(message = "Email invalide")
    @NotBlank
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    @Builder.Default
    private String role="EXTERNAL_COMPANY";
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AccountStatus status =AccountStatus.PENDING;
    private String contactName;
    private String phone;
    @OneToMany(mappedBy = "externalCompany")
    @JsonIgnore
    @Builder.Default
    private Set<Event> events = new HashSet<>();
}