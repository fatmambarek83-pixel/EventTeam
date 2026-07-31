package com.eventteam.repository;

import com.eventteam.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCategory(String category);
    List<Event> findByStatus(String status);
    List<Event> findByResponsableRH_Id(Long responsableRhId);
    List<Event> findByExternalCompany_Id(Long externalCompanyId);
}