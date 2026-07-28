import {inject} from '@angular/core';
import {CanActivateFn,Router} from "@angular/router";
import {AuthService} from "../Services/auth.service";
import {isEmploye} from "../models/user.model";

export const employeGuard:CanActivateFn=()=>{
  const authService=inject(AuthService);
  const router=inject(Router);
  const currentUser=authService.getCurrentUser();
  if(isEmploye(currentUser)){
    return true;
  }
  router.navigate(['/login']);
  return false;
};
