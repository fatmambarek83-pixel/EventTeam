import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { isResponsableRH } from '../models/user.model';

export const rhGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = authService.getCurrentUser();
  if (isResponsableRH(currentUser)) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
