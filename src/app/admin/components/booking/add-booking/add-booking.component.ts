import { Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/admin/models/booking.model';
import { BookingService } from 'src/app/admin/services/booking.service';
import { AuthService } from 'src/app/admin/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.css']
})
export class AddBookingComponent implements OnInit {

  citiesPermission: boolean = false;
  forCity: string = '';

  booking: Booking = {
    city: '',
    name: '',
    phone_number: '+',
    date: this.getTodayDate(),
    payment_type: '',
    total_people: undefined,
    total_money: undefined
  };

  submitted = false;

  constructor(private bookingService: BookingService, private authService: AuthService, private router: Router) {
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {
    this.forCity = this.authService.getForCity() ?? '';
    this.citiesPermission = this.authService.isAdmin();

  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  saveBooking(): void {
    let cityValue: string;
    if (this.citiesPermission) {
      cityValue = this.booking.city!;
    } else {
      cityValue = this.forCity;
    }
    const data = {
      city: cityValue,
      name: this.booking.name,
      phone_number: this.booking.phone_number,
      date: this.booking.date,
      payment_type: this.booking.payment_type,
      total_people: this.booking.total_people != null ? this.booking.total_people : undefined,
      total_money: this.booking.total_money != null ? this.booking.total_money : undefined
    };
    this.bookingService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
          window.location.reload();
        },
        error: (e) => console.error("Error during booking creation:", e)
      });
  }
  newBooking(): void {
    this.submitted = false;
    this.booking = {
      city: '',
      name: '',
      phone_number: '',
      date: this.getTodayDate(),
      payment_type: '',
      total_people: undefined,
      total_money: undefined
    };
  }
  // ================================= VALIDATE =================================
  validateName() {
    return this.bookingService.validateName();
  }
  validatePhone() {
    return this.bookingService.validatePhone();
  }
  validateDate() {
    return this.bookingService.validateDate();
  }
  validateTotalPeople() {
    return this.bookingService.validateTotalPeople();
  }
  validateTotalMoney() {
    return this.bookingService.validateTotalMoney();
  }
  onCityChange(event: any): void {
    this.booking.city = event.target.value;
  }
  isBookingValid(): boolean {
    return (
      (!this.citiesPermission || !!this.booking.city) &&
      this.bookingService.validateName() &&
      this.bookingService.validatePhone() &&
      this.bookingService.validateDate() &&
      this.bookingService.validateTotalPeople() &&
      this.bookingService.validateTotalMoney()
    );
  }

}
