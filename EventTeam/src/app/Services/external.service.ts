import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { ExternalCompany } from '../models/user.model';
@Injectable({ providedIn: 'root' })
export class ExternalService {
  private profileSubject = new BehaviorSubject<ExternalCompany | null>(null);
  /** Shared stream so the sidebar, header, and profile page all stay in sync. */
  profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ExternalCompany> {
    return this.http.get<ExternalCompany>(API_ENDPOINTS.EXTERNAL_PROFILE).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }
  updatePhoto(photo: string): Observable<ExternalCompany> {
    return this.http.put<ExternalCompany>(API_ENDPOINTS.EXTERNAL_PROFILE_PHOTO, { photo }).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }
  deletePhoto(): Observable<ExternalCompany> {
    return this.http.delete<ExternalCompany>(API_ENDPOINTS.EXTERNAL_PROFILE_PHOTO).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }
  getAll(): Observable<ExternalCompany[]> {
    return this.http.get<ExternalCompany[]>(API_ENDPOINTS.EXTERNAL_COMPANIES);
  }
  getById(id: number): Observable<ExternalCompany> {
    return this.http.get<ExternalCompany>(`${API_ENDPOINTS.EXTERNAL_COMPANIES}/${id}`);
  }
  update(id: number, company: Partial<ExternalCompany>): Observable<ExternalCompany> {
    return this.http.put<ExternalCompany>(`${API_ENDPOINTS.EXTERNAL_COMPANIES}/${id}`, company);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.EXTERNAL_COMPANIES}/${id}`);
  }
  getPending(): Observable<ExternalCompany[]> {
    return this.http.get<ExternalCompany[]>(`${API_ENDPOINTS.EXTERNAL_COMPANIES}/pending`);
  }
  validate(id: number): Observable<ExternalCompany> {
    return this.http.put<ExternalCompany>(`${API_ENDPOINTS.EXTERNAL_COMPANIES}/${id}/validate`, {});
  }
  reject(id: number): Observable<ExternalCompany> {
    return this.http.put<ExternalCompany>(`${API_ENDPOINTS.EXTERNAL_COMPANIES}/${id}/reject`, {});
  }
}
