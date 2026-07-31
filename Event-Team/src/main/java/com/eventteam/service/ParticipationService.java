package com.eventteam.service;

import com.eventteam.dto.ParticipationDto;
import com.eventteam.entity.AccountStatus;
import com.eventteam.entity.Employe;
import com.eventteam.entity.Event;
import com.eventteam.entity.ExternalCompany;
import com.eventteam.entity.Participation;
import com.eventteam.entity.ParticipationStatus;
import com.eventteam.repository.EmployeRepository;
import com.eventteam.repository.EventRepository;
import com.eventteam.repository.ExternalCompanyRepository;
import com.eventteam.repository.ParticipationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ParticipationService {

  private final ParticipationRepository participationRepository;
  private final EventRepository eventRepository;
  private final EmployeRepository employeRepository;
  private final ExternalCompanyRepository externalCompanyRepository;
  private final EmailService emailService;

  private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");

  public List<ParticipationDto> findAll() {
    return participationRepository.findAll().stream().map(this::toDto).toList();
  }

  public List<ParticipationDto> findByEmploye(Long employeId) {
    return participationRepository.findByEmployeId(employeId).stream().map(this::toDto).toList();
  }

  public List<ParticipationDto> findByExternalCompany(Long externalCompanyId) {
    return participationRepository.findByExternalCompanyId(externalCompanyId).stream().map(this::toDto).toList();
  }

  /** Un employé demande à rejoindre un event : créé en statut EN_ATTENTE (ou réactive une annulation précédente). */
  public Participation participer(Long eventId, Long employeId) {
    Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event introuvable avec id: " + eventId));
    Employe employe = employeRepository.findById(employeId)
            .orElseThrow(() -> new RuntimeException("Employe introuvable avec id: " + employeId));

    Participation participation = participationRepository.findByEvent_IdAndEmployeId(eventId, employeId)
            .orElseGet(() -> Participation.builder().event(event).employe(employe).build());

    if (participation.getStatus() == ParticipationStatus.ANNULEE
            || participation.getStatus() == ParticipationStatus.REFUSEE) {
      participation.setStatus(ParticipationStatus.EN_ATTENTE);
    }
    return participationRepository.save(participation);
  }

  /** Un employé annule sa participation (statut ANNULEE, conservée pour l'historique). */
  public void annuler(Long eventId, Long employeId) {
    Participation participation = participationRepository.findByEvent_IdAndEmployeId(eventId, employeId)
            .orElseThrow(() -> new RuntimeException("Participation introuvable"));
    participation.setStatus(ParticipationStatus.ANNULEE);
    participationRepository.save(participation);
  }

  /** Une entreprise externe demande à rejoindre un event : créé en statut EN_ATTENTE (ou réactive une annulation précédente). */
  public Participation participerExternal(Long eventId, Long externalCompanyId) {
    Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event introuvable avec id: " + eventId));
    ExternalCompany company = externalCompanyRepository.findById(externalCompanyId)
            .orElseThrow(() -> new RuntimeException("Entreprise introuvable avec id: " + externalCompanyId));

    Participation participation = participationRepository.findByEvent_IdAndExternalCompanyId(eventId, externalCompanyId)
            .orElseGet(() -> Participation.builder().event(event).externalCompany(company).build());

    if (participation.getStatus() == ParticipationStatus.ANNULEE
            || participation.getStatus() == ParticipationStatus.REFUSEE) {
      participation.setStatus(ParticipationStatus.EN_ATTENTE);
    }
    return participationRepository.save(participation);
  }

  /** Une entreprise externe annule sa participation (statut ANNULEE, conservée pour l'historique). */
  public void annulerExternal(Long eventId, Long externalCompanyId) {
    Participation participation = participationRepository.findByEvent_IdAndExternalCompanyId(eventId, externalCompanyId)
            .orElseThrow(() -> new RuntimeException("Participation introuvable"));
    participation.setStatus(ParticipationStatus.ANNULEE);
    participationRepository.save(participation);
  }

  /** Le RH accepte ou refuse une demande de participation. */
  public ParticipationDto updateStatus(Long id, ParticipationStatus status) {
    Participation participation = participationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Participation introuvable avec id: " + id));
    participation.setStatus(status);
    Participation saved = participationRepository.save(participation);

    if (status == ParticipationStatus.ACCEPTEE) {
      notifyAccepted(saved);
    } else if (status == ParticipationStatus.REFUSEE) {
      notifyRefused(saved);
    }

    return toDto(saved);
  }

  /** Envoie un email de confirmation au participant. */
  private void notifyAccepted(Participation p) {
    String eventName = p.getEvent() != null ? p.getEvent().getName() : "";
    if (p.getEmploye() != null) {
      Employe employe = p.getEmploye();
      emailService.sendParticipationAccepted(employe.getEmail(), employe.getName(), eventName);
    } else if (p.getExternalCompany() != null) {
      ExternalCompany company = p.getExternalCompany();
      emailService.sendParticipationAccepted(company.getEmail(), company.getName(), eventName);
    }
  }

  /** Envoie un email de refus au participant et bloque son accès (il ne peut plus se connecter). */
  private void notifyRefused(Participation p) {
    String eventName = p.getEvent() != null ? p.getEvent().getName() : "";
    if (p.getEmploye() != null) {
      Employe employe = p.getEmploye();
      employe.setStatus(AccountStatus.REJECTED);
      employeRepository.save(employe);
      emailService.sendParticipationRefused(employe.getEmail(), employe.getName(), eventName);
    } else if (p.getExternalCompany() != null) {
      ExternalCompany company = p.getExternalCompany();
      company.setStatus(AccountStatus.REJECTED);
      externalCompanyRepository.save(company);
      emailService.sendParticipationRefused(company.getEmail(), company.getName(), eventName);
    }
  }

  public ParticipationStatus fromFrenchLabel(String label) {
    if (label == null) throw new RuntimeException("Statut manquant");
    return switch (label.trim()) {
      case "Accepté", "ACCEPTEE" -> ParticipationStatus.ACCEPTEE;
      case "En attente", "EN_ATTENTE" -> ParticipationStatus.EN_ATTENTE;
      case "Refusé", "REFUSEE" -> ParticipationStatus.REFUSEE;
      case "Annulé", "ANNULEE" -> ParticipationStatus.ANNULEE;
      default -> throw new RuntimeException("Statut inconnu: " + label);
    };
  }

  private ParticipationDto toDto(Participation p) {
    Employe employe = p.getEmploye();
    ExternalCompany company = p.getExternalCompany();
    Event event = p.getEvent();

    Long participantId = employe != null ? employe.getId() : (company != null ? company.getId() : null);
    String participantName = employe != null ? employe.getName() : (company != null ? company.getName() : null);

    return ParticipationDto.builder()
            .id(p.getId())
            .employeId(participantId)
            .participantName(participantName)
            .participantDepartment(company != null ? "Entreprise Ext." : "")
            .avatarInitials(initials(participantName))
            .eventId(event != null ? event.getId() : null)
            .eventName(event != null ? event.getName() : null)
            .eventLocation(event != null ? event.getLocation() : null)
            .date(event != null && event.getStartDate() != null ? DATE_FORMAT.format(event.getStartDate()) : null)
            .status(toFrenchLabel(p.getStatus()))
            .build();
  }

  private String toFrenchLabel(ParticipationStatus status) {
    return switch (status) {
      case ACCEPTEE -> "Accepté";
      case EN_ATTENTE -> "En attente";
      case REFUSEE -> "Refusé";
      case ANNULEE -> "Annulé";
    };
  }

  private String initials(String name) {
    if (name == null || name.isBlank()) return "U";
    String[] parts = name.trim().split("\\s+");
    String first = parts.length > 0 && !parts[0].isEmpty() ? parts[0].substring(0, 1) : "";
    String second = parts.length > 1 && !parts[1].isEmpty() ? parts[1].substring(0, 1) : "";
    return (first + second).toUpperCase();
  }
}