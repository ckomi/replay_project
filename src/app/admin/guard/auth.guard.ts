import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('AuthGuard canActivate called');
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      console.log('User not authenticated, redirecting to login');
      this.router.navigate(['/mikrobuva/login']);
      return false;
    }
  }
}
