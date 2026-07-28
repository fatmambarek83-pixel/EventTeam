import { Role } from '../constants/role.constants';

export interface LoginRequest {
  email: string;
  password: string;
  role: Role;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  id: number;
  email: string;
  role: Role;
  name?: string;
}
