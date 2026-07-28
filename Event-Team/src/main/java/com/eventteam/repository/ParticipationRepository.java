package com.eventteam.repository;

import com.eventteam.entity.Participation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParticipationRepository extends JpaRepository<Participation, Long> {
    List<Participation> findByEmployeId(Long employeId);
    List<Participation> findByExternalCompanyId(Long externalCompanyId);
    List<Participation> findByEvent_Id(Long eventId);
    Optional<Participation> findByEvent_IdAndEmployeId(Long eventId, Long employeId);
    Optional<Participation> findByEvent_IdAndExternalCompanyId(Long eventId, Long externalCompanyId);
}