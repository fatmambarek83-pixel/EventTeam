import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { Event } from '../models/event.model';
@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private http: HttpClient) {}
  getAll(): Observable<Event[]> {
    return this.http.get<Event[]>(API_ENDPOINTS.EVENTS);
  }
  getById(id: number): Observable<Event> {
    return this.http.get<Event>(`${API_ENDPOINTS.EVENTS}/${id}`);
  }
  create(event: Event): Observable<Event> {
    return this.http.post<Event>(API_ENDPOINTS.EVENTS, event);
  }
  update(id: number, event: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${API_ENDPOINTS.EVENTS}/${id}`, event);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.EVENTS}/${id}`);
  }
}
