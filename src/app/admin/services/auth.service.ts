import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import * as JWT from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth';
  private token: string | null = null;
  private forCity: string | null = null;
  private blockUserSubject = new Subject<boolean>();
  private isUserBlocked: boolean = false;
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient) {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decodedToken: any = JWT.jwtDecode(storedToken);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp && decodedToken.exp >= currentTime) {
        console.log("Token je vazeci!");
        this.token = storedToken;
      } else {
        console.log("Token je ISTEKAO!");
      }
    }
  }

  login(credentials: any): Observable<any> {
    console.log('AuthService login called');
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.status === 418) {
          errorMessage = 'Too many login attempts. Please try again later.';
          this.blockUserSubject.next(true);
        } else if (error.status === 404) {
          errorMessage = 'Incorrect username.';
        } else if (error.status === 401) {
          errorMessage = 'Incorrect password.';
        } else if (error.status === 500) {
          errorMessage = 'Server error occurred.';
        } else {
          errorMessage = 'An unexpected error occurred.';
        }
        console.log('Error message:', errorMessage);
        return throwError(errorMessage);
      }),
      tap((response: any) => {
        this.forCity = response.for_city;
        localStorage.setItem('forCity', response.for_city);
        this.isLoggedIn.next(true);
      })
    );
  }
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }
  isAuthenticated(): boolean {
    return !!this.token && !this.isUserBlocked;
  }
  getToken(): string | null {
    return this.token;
  }
  getForCity(): string | null {
    this.forCity = localStorage.getItem('forCity');
    console.log("getForCity- service: ", this.forCity);
    return this.forCity;
  }
  isAdmin(): boolean {
    const forCity = localStorage.getItem('forCity');
    console.log("citiesPermission: ", forCity === 'All');
    return forCity === 'All';
  }
  getBlockUserSubject(): Subject<boolean> {
    return this.blockUserSubject;
  }
  blockUser() {
    this.blockUserSubject.next(true);
  }
  isBlocked(): boolean {
    return this.isUserBlocked;
  }
  checkUserBlocked(): void {
    this.http.get<any>(`${this.baseUrl}/checkUserBlocked`).subscribe(
      response => {
        this.isUserBlocked = response.blocked;
        this.blockUserSubject.next(this.isUserBlocked);
      },
      error => {
        console.error('Error checking user block status:', error);
      }
    );
  }
}
