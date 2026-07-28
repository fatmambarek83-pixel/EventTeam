package com.eventteam.repository;
import com.eventteam.entity.ResponsableRH;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface ResponsableRHRepository extends JpaRepository<ResponsableRH,Long>{
    Optional<ResponsableRH> findByEmail(String email);
    boolean existsByEmail(String email);
}