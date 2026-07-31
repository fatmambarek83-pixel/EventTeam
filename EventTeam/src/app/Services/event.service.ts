import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { Event } from '../models/event.model';
import { ImageService } from './image.service';
@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private http: HttpClient, private imageService: ImageService) {}
  getAll(): Observable<Event[]> {
    return forkJoin([
      this.http.get<Event[]>(API_ENDPOINTS.EVENTS),
      this.imageService.getAllEventImagePaths().pipe(catchError(() => of({} as Record<string, string>))),
    ]).pipe(
      map(([events, images]) =>
        events.map((e) => ({ ...e, imageUrl: e.id != null ? images[String(e.id)] : undefined }))
      )
    );
  }
  getById(id: number): Observable<Event> {
    return forkJoin([
      this.http.get<Event>(`${API_ENDPOINTS.EVENTS}/${id}`),
      this.imageService.getByEvent(id).pipe(
        map((img) => img?.path),
        catchError(() => of(undefined))
      ),
    ]).pipe(map(([event, imageUrl]) => ({ ...event, imageUrl })));
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
