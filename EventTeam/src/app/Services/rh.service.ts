import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import {
  Activity,
  EventItem,
  Participation,
  FeedbackEvent,
  PendingAccount,
  ExternalCompany,
  DashboardStats,
} from '../models/rh.model';

interface BackendAccount { id: number; name: string; email: string; status: string; }
interface BackendEvent {
  id: number; name: string; description?: string;
  startDate: string; endDate: string; location: string;
  capacity: number; participantsCount?: number; status: string; imageUrl?: string;
}

function initialsOf(name: string): string {
  return (name || '').trim().split(/\s+/).slice(0, 2)
    .map(part => part.charAt(0).toUpperCase()).join('');
}

function toEventItem(e: BackendEvent): EventItem {
  return {
    id: String(e.id), name: e.name, description: e.description ?? '',
    date: e.startDate, location: e.location, maxCapacity: e.capacity,
    registeredCount: e.participantsCount ?? 0,
    activityId: '', status: e.status as EventItem['status'], imageUrl: e.imageUrl,
  };
}

function toBackendEvent(item: Partial<EventItem>): Partial<BackendEvent> {
  const payload: Partial<BackendEvent> = {};
  if (item.name !== undefined) payload.name = item.name;
  if (item.description !== undefined) payload.description = item.description;
  if (item.date !== undefined) { payload.startDate = item.date; payload.endDate = item.date; }
  if (item.location !== undefined) payload.location = item.location;
  if (item.maxCapacity !== undefined) payload.capacity = item.maxCapacity;
  if (item.status !== undefined) payload.status = item.status;
  return payload;
}

@Injectable({ providedIn: 'root' })
export class RhService {
  constructor(private http: HttpClient) {}

  getEvents(): Observable<EventItem[]> {
    return this.http.get<BackendEvent[]>(API_ENDPOINTS.EVENTS)
      .pipe(map(events => events.map(toEventItem)));
  }
  getEventById(id: string): Observable<EventItem> {
    return this.http.get<BackendEvent>(`${API_ENDPOINTS.EVENTS}/${id}`).pipe(map(toEventItem));
  }
  createEvent(event: Omit<EventItem, 'id' | 'registeredCount'>): Observable<EventItem> {
    return this.http.post<BackendEvent>(API_ENDPOINTS.EVENTS, toBackendEvent(event)).pipe(map(toEventItem));
  }
  updateEvent(id: string, changes: Partial<EventItem>): Observable<EventItem> {
    return this.http.put<BackendEvent>(`${API_ENDPOINTS.EVENTS}/${id}`, toBackendEvent(changes)).pipe(map(toEventItem));
  }
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.EVENTS}/${id}`);
  }
  getUpcomingEvents(): Observable<EventItem[]> {
    return this.http.get<BackendEvent[]>(`${API_ENDPOINTS.EVENTS}?status=À venir`)
      .pipe(map(events => events.map(toEventItem)));
  }
  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(API_ENDPOINTS.ACTIVITIES);
  }
  deleteActivity(id: string): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.ACTIVITIES}/${id}`);
  }
  getParticipations(): Observable<Participation[]> {
    return this.http.get<Participation[]>(API_ENDPOINTS.PARTICIPATIONS);
  }
  updateParticipationStatus(id: string, status: 'Accepté' | 'Refusé'): Observable<Participation> {
    return this.http.put<Participation>(`${API_ENDPOINTS.PARTICIPATIONS}/${id}`, { status });
  }
  getFeedbackEvents(): Observable<FeedbackEvent[]> {
    return this.http.get<FeedbackEvent[]>(API_ENDPOINTS.FEEDBACKS);
  }
  getFeedbackByEventId(eventId: string): Observable<FeedbackEvent> {
    return this.http.get<FeedbackEvent>(`${API_ENDPOINTS.FEEDBACKS}/event/${eventId}`);
  }
  getPendingAccounts(): Observable<PendingAccount[]> {
    return forkJoin({
      employees: this.http.get<BackendAccount[]>(`${API_ENDPOINTS.EMPLOYES}/pending`),
      companies: this.http.get<BackendAccount[]>(`${API_ENDPOINTS.EXTERNAL_COMPANIES}/pending`),
    }).pipe(
      map(({ employees, companies }) => [
        ...employees.map((e): PendingAccount => ({
          id: String(e.id), name: e.name, email: e.email,
          category: 'Employé interne', type: 'Employé', avatarInitials: initialsOf(e.name),
        })),
        ...companies.map((c): PendingAccount => ({
          id: String(c.id), name: c.name, email: c.email,
          category: 'Entreprise externe', type: 'Entreprise Ext.', avatarInitials: initialsOf(c.name),
        })),
      ])
    );
  }
  getActiveEmployees(): Observable<PendingAccount[]> {
    return this.http.get<BackendAccount[]>(API_ENDPOINTS.EMPLOYES).pipe(
      map(list => list.filter(e => e.status === 'APPROVED').map((e): PendingAccount => ({
        id: String(e.id), name: e.name, email: e.email,
        category: 'Employé interne', type: 'Employé', avatarInitials: initialsOf(e.name),
      })))
    );
  }
  getExternalCompanies(): Observable<ExternalCompany[]> {
    return this.http.get<BackendAccount[]>(API_ENDPOINTS.EXTERNAL_COMPANIES).pipe(
      map(list => list.filter(c => c.status === 'APPROVED').map((c): ExternalCompany => ({
        id: String(c.id), name: c.name, email: c.email,
        status: 'Accepté', avatarInitials: initialsOf(c.name),
      })))
    );
  }
  activateAccount(account: PendingAccount): Observable<void> {
    const base = account.type === 'Employé' ? API_ENDPOINTS.EMPLOYES : API_ENDPOINTS.EXTERNAL_COMPANIES;
    return this.http.put<void>(`${base}/${account.id}/validate`, {});
  }
  rejectAccount(account: PendingAccount): Observable<void> {
    const base = account.type === 'Employé' ? API_ENDPOINTS.EMPLOYES : API_ENDPOINTS.EXTERNAL_COMPANIES;
    return this.http.put<void>(`${base}/${account.id}/reject`, {});
  }
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(API_ENDPOINTS.DASHBOARD_STATS);
  }
}
