package com.eventteam.repository;

import com.eventteam.entity.AccountStatus;
import com.eventteam.entity.ExternalCompany;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExternalCompanyRepository extends JpaRepository<ExternalCompany, Long> {
    Optional<ExternalCompany> findByEmail(String email);
    boolean existsByEmail(String email);
    List<ExternalCompany> findAllByStatus(AccountStatus status);
    List<ExternalCompany> findByValidatedBy_Id(Long responsableRhId);
}