package com.eventteam.entity;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
@Builder
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="admin")
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Builder.Default
    @Column(unique = true,updatable = false)
    private UUID uuid = UUID.randomUUID();
    @Column(unique = true,nullable = false)
    private String email;
    private String phone;
    private String position;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    @Builder.Default
    private String role="ADMIN";
    @Column(columnDefinition="TEXT")
    private String photo;
}