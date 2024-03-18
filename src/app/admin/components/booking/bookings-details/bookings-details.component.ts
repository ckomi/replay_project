import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Booking } from 'src/app/admin/models/booking.model';
import { BookingService } from 'src/app/admin/services/booking.service';

@Component({
  selector: 'app-bookings-details',
  templateUrl: './bookings-details.component.html',
  styleUrls: ['./bookings-details.component.css']
})
export class BookingsDetailsComponent implements OnInit, OnDestroy {
  allBookings: Booking[] = [];
  selectedDate: string = '';
  bookingsForDate: Booking[] = [];
  formattedDate: string = '';
  totalPeople: number = 0;
  totalMoney: number = 0;
  noBookingsVisible: boolean = false;
  private bookingsSubscription: Subscription | undefined;
  private citySubscription: Subscription | undefined;
  cityFromRoute: string = '';
  bookingId: number = 0;

  constructor(private route: ActivatedRoute, private router: Router, private bookingService: BookingService) { }

  ngOnInit(): void {
    this.loadBookingsDetails();
  }

  ngOnDestroy(): void {
    if (this.bookingsSubscription) {
      this.bookingsSubscription.unsubscribe();
    }
    if (this.citySubscription) {
      this.citySubscription.unsubscribe();
    }
  }

  loadBookingsDetails(){
    this.citySubscription = this.bookingService.getForCity$().subscribe(city => {
      this.route.params.subscribe(params => {
        const date = params['date'] || '';
        this.cityFromRoute = params['city'] || '';
        this.selectedDate = date;
        this.formattedDate = this.formatDate(date);
        this.bookingId = +params['id'];
        if (this.cityFromRoute) {
          this.getBookings(this.cityFromRoute);
        } else {
          this.getBookings();
        }
      });
    });
  }

  getBookings(city?: string): void {
    this.bookingsSubscription = this.bookingService.allBookings$.subscribe(bookings => {
      this.allBookings = bookings;

      if (city && city !== 'All') {
        this.bookingsForDate = this.allBookings.filter(booking =>
          booking.date && this.isSameDate(booking.date, this.formattedDate) && booking.city === city
        );
      } else {
        this.bookingsForDate = this.allBookings.filter(booking =>
          booking.date && this.isSameDate(booking.date, this.formattedDate)
        );
      }
      this.redirectIfNoBookings();
      this.calculateTotalPeopleAndMoney();
    });
  }

  redirectIfNoBookings(): void {
    setTimeout(() => {
      if (this.bookingsForDate.length === 0) {
        this.router.navigate(['/bookings']);
      }
    }, 1500);
  }

  isSameDate(date: string | Date | undefined, formattedDate: string): boolean {
    if (!date) return false;
    if (typeof date === 'string') {
      return date === formattedDate;
    } else {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return formattedDate === `${year}-${this.padZero(month)}-${this.padZero(day)}`;
    }
  }

  formatDate(dateString: string): string {
    const [day, monthStr, year] = dateString.split('-');
    const month = parseInt(monthStr, 10);
    const formattedDate = new Date(parseInt(year), month - 1, parseInt(day, 10));

    if (!isNaN(formattedDate.getTime())) {
      return `${year}-${this.padZero(month)}-${this.padZero(parseInt(day, 10))}`;
    } else {
      return 'Invalid Date';
    }
  }

  formatDateFrontend(dateString: string): string {
    const [day, monthStr, year] = dateString.split('-');
    const month = parseInt(monthStr, 10);
    const formattedDate = new Date(parseInt(year), month - 1, parseInt(day, 10));

    if (!isNaN(formattedDate.getTime())) {
      const dayOfWeek = this.getDayOfWeek(formattedDate);
      return `${dayOfWeek}, ${this.padZero(parseInt(day, 10))}-${this.padZero(month)}-${year}`;
    } else {
      return 'Invalid Date';
    }
  }

  getDayOfWeek(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = date.getDay();
    return days[dayIndex];
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  calculateTotalPeopleAndMoney(): void {
    this.totalPeople = this.bookingsForDate.reduce((total, booking) => total + (booking.total_people || 0), 0);
    this.totalMoney = this.bookingsForDate.reduce((total, booking) => total + (booking.total_money || 0), 0);
  }

  deleteBooking(booking: Booking): void {
    if (booking) {
      this.bookingService.delete(booking.id).subscribe(() => {
        location.reload();
      }, error => {
        console.error('Error deleting booking:', error);
      });
    }
  }
  openWhatsapp(phoneNumber: string | undefined): void {
    if (phoneNumber) {
      const formattedPhoneNumber = phoneNumber.substring(1); // Uklanja prvi karakter (znak +)
      window.open('https://wa.me/' + formattedPhoneNumber, '_blank');
    }
  }
}
