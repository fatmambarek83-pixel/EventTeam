import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { ExternalCompany } from '../models/user.model';
@Injectable({ providedIn: 'root' })
export class ExternalService {
  constructor(private http: HttpClient) {}
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
