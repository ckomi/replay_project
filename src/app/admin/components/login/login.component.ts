import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/admin/services/auth.service';
import { UserService } from 'src/app/admin/services/user.service';
import { AdminComponent } from 'src/app/admin/admin.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  user_name = '';
  user_password = '';
  errorMessage = '';
  loginDisabled: boolean = false;
  blockUserSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router, private adminComponent: AdminComponent, private userService: UserService) {}

  ngOnInit(): void {
    this.authService.checkUserBlocked();
    this.blockUserSubscription = this.authService.getBlockUserSubject().subscribe(
      blocked => {
        console.log('Blocked user:', blocked);
        this.loginDisabled = blocked;
      }
    );
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/mikrobuva/bookings']);
   }
  }

  ngOnDestroy(): void {
    this.blockUserSubscription.unsubscribe();
  }

  login(): void {
    const credentials = {
      user_name: this.user_name,
      user_password: this.user_password
    };
    this.authService.login(credentials)
      .subscribe(
        res => {
          this.authService.setToken(res.token);
          this.adminComponent.onLoginSuccess();
          this.errorMessage = '';
          this.router.navigate(['/mikrobuva/bookings']);
        },
        error => {
          this.errorMessage = error || 'An unexpected error occurred.';
        }
      );
  }
// ================================= VALIDATE =================================
  validateUsername() {
    return this.userService.validateUsername();
  }
  validatePassword() {
    return this.userService.validatePassword();
  }
  isFormValid():boolean {
    return this.userService.validateUsername() && this.userService.validatePassword();
  }
}
