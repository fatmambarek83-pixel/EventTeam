import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { ResponsableRH } from '../models/user.model';
@Injectable({ providedIn: 'root' })
export class ResponsableRhService {
  private profileSubject = new BehaviorSubject<ResponsableRH | null>(null);
  /** Shared stream so the sidebar, header, and profile page all stay in sync. */
  profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ResponsableRH> {
    return this.http.get<ResponsableRH>(API_ENDPOINTS.RH_PROFILE).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }
  updatePhoto(photo: string): Observable<ResponsableRH> {
    return this.http.put<ResponsableRH>(API_ENDPOINTS.RH_PROFILE_PHOTO, { photo }).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }
  deletePhoto(): Observable<ResponsableRH> {
    return this.http.delete<ResponsableRH>(API_ENDPOINTS.RH_PROFILE_PHOTO).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }
  getAll(): Observable<ResponsableRH[]> {
    return this.http.get<ResponsableRH[]>(API_ENDPOINTS.RESPONSABLES_RH);
  }
  getById(id: number): Observable<ResponsableRH> {
    return this.http.get<ResponsableRH>(`${API_ENDPOINTS.RESPONSABLES_RH}/${id}`);
  }
  update(id: number, rh: Partial<ResponsableRH>): Observable<ResponsableRH> {
    return this.http.put<ResponsableRH>(`${API_ENDPOINTS.RESPONSABLES_RH}/${id}`, rh);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.RESPONSABLES_RH}/${id}`);
  }
}
