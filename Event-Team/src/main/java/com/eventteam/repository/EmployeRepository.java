package com.eventteam.repository;
import com.eventteam.entity.Employe;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface EmployeRepository extends JpaRepository<Employe, Long> {
    Optional<Employe> findByEmail(String email);
    boolean existsByEmail(String email);
}
