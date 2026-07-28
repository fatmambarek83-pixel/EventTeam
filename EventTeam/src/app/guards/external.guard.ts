import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { isExternalCompany } from '../models/user.model';

export const externalGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = authService.getCurrentUser();
  if (isExternalCompany(currentUser)) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
