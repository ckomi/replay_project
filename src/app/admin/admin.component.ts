import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  title = 'ReplayPanel';
  isMobile: Observable<boolean>;
  isAdminUser: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService) {
    this.isMobile = this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnInit(): void {
    this.onLoginSuccess();
  }

  onLoginSuccess(): void {
    this.isAdminUser = this.authService.isAdmin();
    this.isLoggedIn = this.authService.isAuthenticated();
    console.log("Provera statusa autentikacije: ", this.isLoggedIn);
  }
}
