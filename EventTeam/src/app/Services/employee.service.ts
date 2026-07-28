import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { Employe } from '../models/user.model';
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private http: HttpClient) {}
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
