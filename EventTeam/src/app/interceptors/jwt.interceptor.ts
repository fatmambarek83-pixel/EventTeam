import {HttpInterceptorFn} from "@angular/common/http";
export const jwtInterceptor:HttpInterceptorFn=(req,next)=>{
  const token=localStorage.getItem('event_team_token');
  const isAuthRequest =req.url.includes('/auth/login')||req.url.includes('/auth/register');
  if(token && !isAuthRequest){
    const cloned=req.clone({setHeaders:{Authorization:`Bearer ${token}`}});
    return next(cloned);
  }
  return next(req);
}
