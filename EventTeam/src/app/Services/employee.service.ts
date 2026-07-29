import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { Employe } from '../models/user.model';
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private profileSubject = new BehaviorSubject<Employe | null>(null);
  /** Shared stream so the sidebar, header, and profile page all stay in sync. */
  profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProfile(): Observable<Employe> {
    return this.http.get<Employe>(API_ENDPOINTS.EMPLOYE_PROFILE).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }
  updatePhoto(photo: string): Observable<Employe> {
    return this.http.put<Employe>(API_ENDPOINTS.EMPLOYE_PROFILE_PHOTO, { photo }).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }
  deletePhoto(): Observable<Employe> {
    return this.http.delete<Employe>(API_ENDPOINTS.EMPLOYE_PROFILE_PHOTO).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }
  getAll(): Observable<Employe[]> {
    return this.http.get<Employe[]>(API_ENDPOINTS.EMPLOYES);
  }
  getById(id: number): Observable<Employe> {
    return this.http.get<Employe>(`${API_ENDPOINTS.EMPLOYES}/${id}`);
  }
  update(id: number, employe: Partial<Employe>): Observable<Employe> {
    return this.http.put<Employe>(`${API_ENDPOINTS.EMPLOYES}/${id}`, employe);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.EMPLOYES}/${id}`);
  }
  getPending(): Observable<Employe[]> {
    return this.http.get<Employe[]>(`${API_ENDPOINTS.EMPLOYES}/pending`);
  }
  validate(id: number): Observable<Employe> {
    return this.http.put<Employe>(`${API_ENDPOINTS.EMPLOYES}/${id}/validate`, {});
  }
  reject(id: number): Observable<Employe> {
    return this.http.put<Employe>(`${API_ENDPOINTS.EMPLOYES}/${id}/reject`, {});
  }
}
