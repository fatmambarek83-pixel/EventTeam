import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { Participation } from '../models/participation.model';
import { Event } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class ParticipationService {
  constructor(private http: HttpClient) {}

  getMine(employeId: number): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${API_ENDPOINTS.PARTICIPATIONS}/employe/${employeId}`);
  }

  participer(eventId: number, employeId: number): Observable<Event> {
    return this.http.post<Event>(`${API_ENDPOINTS.PARTICIPATIONS}/event/${eventId}/employe/${employeId}`, {});
  }

  annuler(eventId: number, employeId: number): Observable<Event> {
    return this.http.delete<Event>(`${API_ENDPOINTS.PARTICIPATIONS}/event/${eventId}/employe/${employeId}`);
  }

  getMineExternal(externalCompanyId: number): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${API_ENDPOINTS.PARTICIPATIONS}/external/${externalCompanyId}`);
  }

  participerExternal(eventId: number, externalCompanyId: number): Observable<Event> {
    return this.http.post<Event>(`${API_ENDPOINTS.PARTICIPATIONS}/event/${eventId}/external/${externalCompanyId}`, {});
  }

  annulerExternal(eventId: number, externalCompanyId: number): Observable<Event> {
    return this.http.delete<Event>(`${API_ENDPOINTS.PARTICIPATIONS}/event/${eventId}/external/${externalCompanyId}`);
  }
}
