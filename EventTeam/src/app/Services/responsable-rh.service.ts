import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { ResponsableRH } from '../models/user.model';
@Injectable({ providedIn: 'root' })
export class ResponsableRhService {
  constructor(private http: HttpClient) {}
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
