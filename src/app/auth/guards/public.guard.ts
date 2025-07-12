import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const isAuthenticated = this.cookieService.check('auth_token');

    if (isAuthenticated) {

      const role = this.authService.getUserRole();
      console.warn(`PublicGuard: User is already logged in with role '${role}'. Redirecting.`);

      if (role === 'SuperAdmin') {
        return this.router.createUrlTree(['/super-admin']);
      } else if (role === 'Patient') {
        return this.router.createUrlTree(['/profile']);
      } else if (role === 'HospitalServiceProvider') {
        return this.router.createUrlTree(['/hospitalProvider/specialists']);
      } else if (role === 'ServiceProvider') {
        return this.router.createUrlTree(['/service-provider/dashboard']);
      }
      else {

        return this.router.createUrlTree(['/']);
      }

    } else {

      return true;
    }
  }
}
