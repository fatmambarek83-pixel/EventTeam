package com.eventteam.repository;

import com.eventteam.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image,Long> {
    List<Image> findByActivity_Id(Long activityId);
    List<Image> findByEvent_Id(Long eventId);
    Optional<Image> findFirstByEvent_IdOrderByIdDesc(Long eventId);
    List<Image> findByActivityIsNotNull();
    List<Image> findByEventIsNotNull();
}