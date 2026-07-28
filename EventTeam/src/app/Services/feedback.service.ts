import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { Feedback } from '../models/feedback.model';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  constructor(private http: HttpClient) {}

  getByEvent(eventId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${API_ENDPOINTS.FEEDBACKS}/event/${eventId}`);
  }

  create(eventId: number, employeId: number, payload: Partial<Feedback>): Observable<Feedback> {
    return this.http.post<Feedback>(
      `${API_ENDPOINTS.FEEDBACKS}/event/${eventId}/employe/${employeId}`,
      payload
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.FEEDBACKS}/${id}`);
  }
}
