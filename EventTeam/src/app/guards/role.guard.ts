import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../Services/auth.service";

export const roleGuard:CanActivateFn=(route,state)=>{
  const authService=inject(AuthService);
  const router=inject(Router);
  const allowedRoles:string[]=route.data['roles']??[];
  const userRole=authService.getRole();
  if (userRole && allowedRoles.includes(userRole)){
    return true;
  }
  router.navigate(['/login']);
  return false;
}
