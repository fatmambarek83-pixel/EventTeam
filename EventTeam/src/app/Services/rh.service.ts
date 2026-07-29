import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import {
  Activity,
  ActivityStatus,
  DashboardStats,
  EventItem,
  EventStatus,
  ExternalCompany as RhExternalCompany,
  FeedbackEvent,
  Participation,
  ParticipationStatus,
  PendingAccount,
  Review,
} from '../models/rh.model';
import { Employe, ExternalCompany } from '../models/user.model';
import { Event as BackendEvent } from '../models/event.model';
import { Activity as BackendActivity } from '../models/activity.model';
import { Feedback as BackendFeedback } from '../models/feedback.model';
import { Participation as BackendParticipation } from '../models/participation.model';
import { EmployeeService } from './employee.service';
import { ExternalService } from './external.service';

/**
 * Aggregates data for the RH ("Responsable RH") dashboard screens.
 *
 * NOTE: this file was reconstructed after it got overwritten by a previous
 * change (it was accidentally replaced with the RH *profile/photo* service,
 * now living in `responsable-rh.service.ts`). It's rebuilt from how every
 * rh-* component actually calls it, wired to the real Spring endpoints
 * (dashboard, events, activities, feedbacks, participations, employes,
 * external-companies). Double check the mapped fields (especially
 * `description`/`activityId` on events and `facilitator` on activities,
 * which the backend doesn't send back 1:1) against what you actually want
 * displayed.
 */
@Injectable({ providedIn: 'root' })
export class RhService {
  constructor(
    private http: HttpClient,
    private employeeService: EmployeeService,
    private externalService: ExternalService
  ) {}

  // ---------------------------------------------------------------------
  // Comptes en attente / actifs
  // ---------------------------------------------------------------------

  getPendingAccounts(): Observable<PendingAccount[]> {
    return forkJoin([this.employeeService.getPending(), this.externalService.getPending()]).pipe(
      map(([employes, companies]) => [
        ...employes.map((e) => this.toPendingAccount(e, 'Employé')),
        ...companies.map((c) => this.toPendingAccount(c, 'Entreprise Ext.')),
      ])
    );
  }

  getActiveEmployees(): Observable<PendingAccount[]> {
    return this.employeeService.getAll().pipe(
      map((list) =>
        list
          .filter((e) => this.isApproved(e.status))
          .map((e) => this.toPendingAccount(e, 'Employé'))
      )
    );
  }

  getExternalCompanies(): Observable<RhExternalCompany[]> {
    return this.externalService.getAll().pipe(
      map((list) =>
        list
          .filter((c) => this.isApproved(c.status))
          .map((c) => ({
            id: String(c.id),
            name: c.name || '',
            email: c.email || '',
            status: 'Accepté' as const,
            avatarInitials: this.initials(c.name),
          }))
      )
    );
  }

  activateAccount(account: PendingAccount): Observable<any> {
    const id = Number(account.id);
    return account.type === 'Employé'
      ? this.employeeService.validate(id)
      : this.externalService.validate(id);
  }

  rejectAccount(account: PendingAccount): Observable<any> {
    const id = Number(account.id);
    return account.type === 'Employé'
      ? this.employeeService.reject(id)
      : this.externalService.reject(id);
  }

  private toPendingAccount(
    item: Employe | ExternalCompany,
    type: 'Employé' | 'Entreprise Ext.'
  ): PendingAccount {
    const isEmploye = type === 'Employé';
    const employe = item as Employe;
    const company = item as ExternalCompany;
    return {
      id: String(item.id),
      name: item.name || '',
      email: item.email || '',
      category: isEmploye
        ? employe.departement || employe.poste || 'Employé'
        : company.contactName || 'Entreprise',
      type,
      avatarInitials: this.initials(item.name),
    };
  }

  private isApproved(status: unknown): boolean {
    return (status as string) === 'APPROVED';
  }

  private initials(name?: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? '';
    const second = parts[1]?.charAt(0) ?? '';
    return (first + second).toUpperCase();
  }

  // ---------------------------------------------------------------------
  // Événements
  // ---------------------------------------------------------------------

  getEvents(): Observable<EventItem[]> {
    return this.http
      .get<BackendEvent[]>(API_ENDPOINTS.EVENTS)
      .pipe(map((list) => list.map((e) => this.mapEvent(e))));
  }

  getEventById(id: string): Observable<EventItem> {
    return this.http
      .get<BackendEvent>(`${API_ENDPOINTS.EVENTS}/${id}`)
      .pipe(map((e) => this.mapEvent(e)));
  }

  getUpcomingEvents(): Observable<EventItem[]> {
    return this.getEvents().pipe(
      map((events) =>
        events
          .filter((e) => e.status === 'À venir')
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 4)
      )
    );
  }

  createEvent(payload: Partial<EventItem>): Observable<EventItem> {
    return this.http
      .post<BackendEvent>(API_ENDPOINTS.EVENTS, this.toBackendEventPayload(payload))
      .pipe(map((e) => this.mapEvent(e)));
  }

  updateEvent(id: string, payload: Partial<EventItem>): Observable<EventItem> {
    return this.http
      .put<BackendEvent>(`${API_ENDPOINTS.EVENTS}/${id}`, this.toBackendEventPayload(payload))
      .pipe(map((e) => this.mapEvent(e)));
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.EVENTS}/${id}`);
  }

  private toBackendEventPayload(payload: Partial<EventItem>) {
    return {
      name: payload.name,
      startDate: payload.date,
      endDate: payload.date,
      location: payload.location,
      capacity: payload.maxCapacity,
      status: payload.status,
    };
  }

  private mapEvent(e: BackendEvent): EventItem {
    return {
      id: e.id != null ? String(e.id) : '',
      name: e.name || e.title || '',
      description: '',
      date: e.startDate,
      location: e.location || '',
      maxCapacity: e.capacity ?? 0,
      registeredCount: e.participantsCount ?? 0,
      activityId: '',
      status: (e.status as EventStatus) || 'À venir',
      imageUrl: undefined,
    };
  }

  // ---------------------------------------------------------------------
  // Activités
  // ---------------------------------------------------------------------

  getActivities(): Observable<Activity[]> {
    return this.http
      .get<BackendActivity[]>(API_ENDPOINTS.ACTIVITIES)
      .pipe(map((list) => list.map((a) => this.mapActivity(a))));
  }

  deleteActivity(id: string): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.ACTIVITIES}/${id}`);
  }

  private mapActivity(a: BackendActivity): Activity {
    return {
      id: a.id != null ? String(a.id) : '',
      name: a.name || '',
      description: a.description || '',
      startDate: a.startDate || '',
      endDate: a.endDate || '',
      facilitator: a.animateur || '',
      status: (a.status as ActivityStatus) || 'Planifié',
      imageUrl: undefined,
    };
  }

  // ---------------------------------------------------------------------
  // Dashboard
  // ---------------------------------------------------------------------

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(API_ENDPOINTS.DASHBOARD_STATS);
  }

  // ---------------------------------------------------------------------
  // Participations
  // ---------------------------------------------------------------------

  getParticipations(): Observable<Participation[]> {
    return this.http
      .get<BackendParticipation[]>(API_ENDPOINTS.PARTICIPATIONS)
      .pipe(map((list) => list.map((p) => this.mapParticipation(p))));
  }

  updateParticipationStatus(id: string, status: 'Accepté' | 'Refusé'): Observable<any> {
    return this.http.put(`${API_ENDPOINTS.PARTICIPATIONS}/${id}`, { status });
  }

  private mapParticipation(p: BackendParticipation): Participation {
    return {
      id: String(p.id),
      participantName: p.participantName || '',
      participantDepartment: p.participantDepartment || '',
      avatarInitials: p.avatarInitials || '',
      eventId: String(p.eventId),
      eventName: p.eventName || '',
      eventLocation: p.eventLocation || '',
      date: p.date || '',
      status: p.status as ParticipationStatus,
    };
  }

  // ---------------------------------------------------------------------
  // Feedbacks
  // ---------------------------------------------------------------------

  getFeedbackEvents(): Observable<FeedbackEvent[]> {
    return forkJoin([this.getEvents(), this.http.get<BackendFeedback[]>(API_ENDPOINTS.FEEDBACKS)]).pipe(
      map(([events, feedbacks]) =>
        events.map((ev) => {
          const evFeedbacks = feedbacks.filter((f) => String(f.eventId) === ev.id);
          return {
            id: ev.id,
            eventId: ev.id,
            eventName: ev.name,
            eventDate: ev.date,
            imageUrl: ev.imageUrl,
            reviews: evFeedbacks.map((f) => this.mapReview(f, ev.date)),
          } as FeedbackEvent;
        })
      )
    );
  }

  getFeedbackByEventId(eventId: string): Observable<FeedbackEvent | undefined> {
    return this.getFeedbackEvents().pipe(map((list) => list.find((f) => f.eventId === eventId)));
  }

  private mapReview(f: BackendFeedback, fallbackDate: string): Review {
    return {
      id: f.id != null ? String(f.id) : '',
      authorName: f.auteurName || 'Anonyme',
      rating: f.stars ?? 0,
      comment: f.commentaire || '',
      date: fallbackDate,
    };
  }
}
