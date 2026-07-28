import { Role } from '../constants/role.constants';
import { AuthResponse } from './auth-response.model';

export interface BaseUser {
  id: number;
  email: string;
  role: Role;
  avatarInitials?: string;
  avatarColor?: string;
  status?: 'active' | 'pending' | 'rejected';
}

export interface Employe extends BaseUser {
  name: string;
  poste?: string;
  departement?: string;
  responsableRhId?: number;
}

export interface ResponsableRH extends BaseUser {
  name: string;
  departement?: string;
}

export interface ExternalCompany extends BaseUser {
  name: string;
  companyName?: string;
  contactName?: string;
  phone?: string;
}

export type User = Employe | ResponsableRH | ExternalCompany;
export function isResponsableRH(
  user: AuthResponse | User | null | undefined
): user is ResponsableRH {
  return !!user && user.role === Role.RESPONSABLE_RH && !!user.id;
}

export function isEmploye(
  user: AuthResponse | User | null | undefined
): user is Employe {
  return !!user && user.role === Role.EMPLOYE && !!user.id;
}
export function isExternalCompany(
  user: AuthResponse | User | null | undefined
): user is ExternalCompany {
  return !!user && user.role === Role.EXTERNAL_COMPANY && !!user.id;
}
