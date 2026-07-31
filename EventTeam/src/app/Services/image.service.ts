import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';

export interface ImagePayload {
  path: string;
  extension?: string;
}

export interface ImageRecord extends ImagePayload {
  id?: number;
  uuid?: string;
}

@Injectable({ providedIn: 'root' })
export class ImageService {
  constructor(private http: HttpClient) {}

  addToEvent(eventId: number | string, payload: ImagePayload): Observable<ImageRecord> {
    return this.http.post<ImageRecord>(`${API_ENDPOINTS.IMAGES}/event/${eventId}`, payload);
  }

  addToActivity(activityId: number | string, payload: ImagePayload): Observable<ImageRecord> {
    return this.http.post<ImageRecord>(`${API_ENDPOINTS.IMAGES}/activity/${activityId}`, payload);
  }

  getByEvent(eventId: number | string): Observable<ImageRecord> {
    return this.http.get<ImageRecord>(`${API_ENDPOINTS.IMAGES}/event/${eventId}`);
  }

  getByActivity(activityId: number | string): Observable<ImageRecord[]> {
    return this.http.get<ImageRecord[]>(`${API_ENDPOINTS.IMAGES}/activity/${activityId}`);
  }

  /** Map eventId -> path, pour tous les événements qui ont une image. */
  getAllEventImagePaths(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(`${API_ENDPOINTS.IMAGES}/events`);
  }

  /** Map activityId -> path, pour toutes les activités qui ont une image. */
  getAllActivityImagePaths(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(`${API_ENDPOINTS.IMAGES}/activities`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.IMAGES}/${id}`);
  }
}
