import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CityAccessGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const userCity = this.authService.getForCity();

    const targetCity = next.params['city'];

    if (userCity === 'All' || userCity === targetCity) {
      return true;
    } else {
      this.router.navigate(['/bookings']);
      return false;
    }
  }
}
