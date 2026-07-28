import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { Role, ROLE_REGISTER_ENDPOINT } from '../constants/role.constants';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth-response.model';
const TOKEN_KEY = 'event_team_token';
const ROLE_KEY = 'event_team_role';
const USER_KEY = 'event_team_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API_ENDPOINTS.AUTH_LOGIN, request).pipe(
      tap(response => this.setSession(response))
    );
  }

  register(request: RegisterRequest): Observable<any> {
    const endpointKey = ROLE_REGISTER_ENDPOINT[request.role];
    if (!endpointKey) {
      throw new Error(`Inscription non disponible pour le rôle ${request.role}`);
    }
    const url = API_ENDPOINTS[endpointKey];
    return this.http.post(url, request);
  }

  private setSession(response: AuthResponse): void {
    if (!this.isBrowser) return;
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(ROLE_KEY, response.role);
    localStorage.setItem(USER_KEY, JSON.stringify(response));
  }

  logout(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_KEY);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  getRole(): Role | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(ROLE_KEY) as Role | null;
  }

  getCurrentUser(): AuthResponse | null {
    if (!this.isBrowser) return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(role: Role): boolean {
    return this.getRole() === role;
  }
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(API_ENDPOINTS.AUTH_FORGOT_PASSWORD, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(API_ENDPOINTS.AUTH_RESET_PASSWORD, { token, newPassword });
  }
}
