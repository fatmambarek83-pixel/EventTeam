import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) {}
  listRH(): Observable<RhAccount[]> {
    return this.http.get<RhAccount[]>(API_ENDPOINTS.ADMIN_RH);
  }
  createRH(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(API_ENDPOINTS.ADMIN_RH, data);
  }
  deleteRH(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.ADMIN_RH}/${id}`);
  }
  getProfile(): Observable<AdminProfile> {
    return this.http.get<AdminProfile>(API_ENDPOINTS.ADMIN_PROFILE);
  }
  updateProfile(data: { name: string; email: string; phone: string; position: string }): Observable<AdminProfile> {
    return this.http.put<AdminProfile>(API_ENDPOINTS.ADMIN_PROFILE, data);
  }
}
