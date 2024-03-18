import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Booking } from 'src/app/admin/models/booking.model';
import { BookingService } from 'src/app/admin/services/booking.service';
import { AuthService } from 'src/app/admin/services/auth.service';

@Component({
  selector: 'app-update-booking',
  templateUrl: './update-booking.component.html',
  styleUrls: ['./update-booking.component.css']
})
export class UpdateBookingComponent implements OnInit {
  booking: Booking = {
    city: '',
    name: '',
    phone_number: '',
    date: '',
    payment_type: '',
    total_people: 0,
    total_money: 0
  };
  bookingId: number = 0;
  formattedDate: string = '';
  formChanged: boolean = false;
  formatedDateReverse: string = '';

  citiesPermission: boolean = false;
  forCity: string = '';

  constructor(private route: ActivatedRoute, private bookingService: BookingService, private location: Location, private authService: AuthService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.bookingId = +params['id'];
      this.fetchBooking();
      this.forCity = this.authService.getForCity() ?? '';
      this.citiesPermission = this.authService.isAdmin();
      this.formatedDateReverse = this.formatDateReverse(this.booking.date);
    });
  }

  fetchBooking(): void {
    this.bookingService.allBookings$.subscribe(bookings => {
      const foundBooking = bookings.find(booking => booking.id === this.bookingId);
      if (foundBooking) {
        this.booking = foundBooking;
        this.formattedDate = foundBooking.date ? this.formatDate(foundBooking.date) : '';
      } else {
      }
    });
  }


  formatDate(date: string | undefined): string {
    if (!date) {
      return '';
    }
    const d = new Date(date);
    const year = d.getFullYear();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  formatDateReverse(date: string | undefined): string {
    if (!date) {
      return '';
    }
    const [year, month, day] = date.split('-');
    return [day, month, year].join('-');
  }
  updateDate(event: any) {
    const newDateValue = event.target.value;
    const newDate = new Date(newDateValue);
    this.booking.date = newDate.toISOString().split('T')[0];
    this.formChanged = true;
  }
  cancelUpdate(): void {
    this.location.back();
  }
  saveBooking() {
    const dateToSave: string = this.formatDate(this.booking.date);
    let cityValue: string;
    if (this.citiesPermission) {
      cityValue = this.booking.city!;
    } else {
      cityValue = this.forCity;
    }
    const updatedBooking = {
      city: cityValue,
      name: this.booking.name,
      phone_number: this.booking.phone_number,
      date: dateToSave,
      payment_type: this.booking.payment_type,
      total_people: this.booking.total_people,
      total_money: this.booking.total_money
    };

    const bookingId = this.booking.id;

    this.bookingService.update(bookingId, updatedBooking)
      .subscribe((response) => {
        this.location.back();
      }, (error) => {
        console.error('Greška prilikom ažuriranja podataka:', error);
      });
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
  onNameChange(event: any) {
    this.formChanged = true;
  }
  onPhoneChange(event: any) {
    this.formChanged = true;
  }
  onDateChange(event: any) {
    this.formChanged = true;
  }
  onPaymentChange(event: any) {
    this.formChanged = true;
  }
  onTotalPeopleChange(event: any) {
    this.formChanged = true;
  }
  onTotalMoneyChange(event: any) {
    this.formChanged = true;
  }
  onCityChange(event: any): void {
    this.booking.city = event.target.value;
  }
  isBookingValid(): boolean {
    return (
      (!this.citiesPermission || !!this.booking.city) &&
      !!this.booking.name &&
      !!this.booking.phone_number &&
      !!this.booking.date &&
      !!this.booking.payment_type &&
      !!this.booking.total_people &&
      !!this.booking.total_money
    );
  }
}
