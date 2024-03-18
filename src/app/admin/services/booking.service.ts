import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Booking } from '../models/booking.model';

import { AuthService } from './auth.service';

const baseUrl = 'http://localhost:8080/api/bookings';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private allBookingsSubject: BehaviorSubject<Booking[]> = new BehaviorSubject<Booking[]>([]);
  public allBookings$: Observable<Booking[]> = this.allBookingsSubject.asObservable();
  private forCity: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.forCity = authService.getForCity() ?? '';
    this.findUpcomingBookings();
  }
  setForCity(city: string): void {
    this.forCity = city;
    this.findUpcomingBookings();
  }
  private findUpcomingBookings(): void {
    this.http.get<Booking[]>(`${baseUrl}/upbookings`).subscribe(
      bookings => {
        this.allBookingsSubject.next(bookings);
      },
      error => {
        console.error('Error loading upcoming bookings:', error);
      }
    );
  }

  getForCity$(): Observable<string | null> {
    return of(this.forCity);
  }

  // Metode za CRUD operacije sa rezervacijama
  get(id: any): Observable<Booking> {
    return this.http.get<Booking>(`${baseUrl}/${id}`);
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
  findByDate(date: any): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${baseUrl}/${date}`);
  }


  // ====================================================================
  // =============== Validation CREATE & UPDATE =========================
  // ====================================================================
  validateName() {
    const nameInput = document.getElementById('name') as HTMLInputElement;
    if (nameInput.value.length < 2) {
      nameInput.classList.add('invalid');
      return false
    } else {
      nameInput.classList.remove('invalid');
      return true
    }
  }
  validatePhone() {
    const phoneInput = document.getElementById('phone') as HTMLInputElement;
    const phonePattern = /^[0-9+-]{6,}$/;
    if (!phonePattern.test(phoneInput.value)) {
      phoneInput.classList.add('invalid');
      return false
    } else {
      phoneInput.classList.remove('invalid');
      return true
    }
  }
  validateDate() {
    const dateInput = document.getElementById('date') as HTMLInputElement;
    const selectedDate = new Date(dateInput.value).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    if (!dateInput.value || selectedDate < today) {
      dateInput.classList.add('invalid');
      return false;
    } else {
      dateInput.classList.remove('invalid');
      return true;
    }
  }
  validateTotalPeople() {
    const totalPeopleInput = document.getElementById('totalPeople') as HTMLInputElement;
    if (totalPeopleInput.value === null || totalPeopleInput.value === '' || parseInt(totalPeopleInput.value) < 1) {
      totalPeopleInput.classList.add('invalid');
      return false
    } else {
      totalPeopleInput.classList.remove('invalid');
      return true
    }
  }
  validateTotalMoney() {
    const totalMoneyInput = document.getElementById('totalMoney') as HTMLInputElement;
    if (totalMoneyInput.value === null || totalMoneyInput.value === '' || parseInt(totalMoneyInput.value) < 1) {
      totalMoneyInput.classList.add('invalid');
      return false
    } else {
      totalMoneyInput.classList.remove('invalid');
      return true
    }
  }
}
