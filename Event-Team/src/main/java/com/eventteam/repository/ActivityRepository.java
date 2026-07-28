package com.eventteam.repository;

import com.eventteam.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByEvent_Id(Long eventId);
}