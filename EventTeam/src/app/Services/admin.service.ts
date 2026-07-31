import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';

export interface RhAccount {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AdminProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  photo?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private profileSubject = new BehaviorSubject<AdminProfile | null>(null);
  /** Shared stream so the sidebar, header, and profile page all stay in sync. */
  profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient) {}
  listRH(): Observable<RhAccount[]> {
    return this.http.get<RhAccount[]>(API_ENDPOINTS.ADMIN_RH);
  }
  getRHById(id: number): Observable<RhAccount> {
    return this.http.get<RhAccount>(`${API_ENDPOINTS.ADMIN_RH}/${id}`);
  }
  createRH(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(API_ENDPOINTS.ADMIN_RH, data);
  }
  deleteRH(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.ADMIN_RH}/${id}`);
  }
  getProfile(): Observable<AdminProfile> {
    return this.http.get<AdminProfile>(API_ENDPOINTS.ADMIN_PROFILE).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }
  updateProfile(data: { name: string; email: string; phone: string; position: string }): Observable<AdminProfile> {
    return this.http.put<AdminProfile>(API_ENDPOINTS.ADMIN_PROFILE, data).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }
  updatePhoto(photo: string): Observable<AdminProfile> {
    return this.http.put<AdminProfile>(API_ENDPOINTS.ADMIN_PROFILE_PHOTO, { photo }).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }
  deletePhoto(): Observable<AdminProfile> {
    return this.http.delete<AdminProfile>(API_ENDPOINTS.ADMIN_PROFILE_PHOTO).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }
}
