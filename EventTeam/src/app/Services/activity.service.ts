import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { Activity } from '../models/activity.model';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Activity[]> {
    return this.http.get<Activity[]>(API_ENDPOINTS.ACTIVITIES);
  }

  getById(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${API_ENDPOINTS.ACTIVITIES}/${id}`);
  }

  getByEvent(eventId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${API_ENDPOINTS.ACTIVITIES}/event/${eventId}`);
  }

  create(eventId: number, activity: Partial<Activity>): Observable<Activity> {
    return this.http.post<Activity>(`${API_ENDPOINTS.ACTIVITIES}/event/${eventId}`, activity);
  }

  update(id: number, activity: Partial<Activity>): Observable<Activity> {
    return this.http.put<Activity>(`${API_ENDPOINTS.ACTIVITIES}/${id}`, activity);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.ACTIVITIES}/${id}`);
  }
}
