import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Booking } from 'src/app/admin/models/booking.model';
import { BookingService } from 'src/app/admin/services/booking.service';
import { AuthService } from 'src/app/admin/services/auth.service';
import { Subscription } from 'rxjs';

interface AllBookingsForDate {
  dayOfWeek: string;
  dateOfBookings: string;
  totalPeople: number;
}

interface DashboardBookings{
  dayInWeek: string;
  bookingsDate: string;
  dateMonth: string;
  cityData: CityData[];
 }

 interface CityData{
  city: string,
  totalPeople: number
 }

@Component({
  selector: 'app-bookings-list',
  templateUrl: './bookings-list.component.html',
  styleUrls: ['./bookings-list.component.css']
})
export class BookingsListComponent implements OnInit, OnDestroy {

  @Output() cityChange: EventEmitter<string> = new EventEmitter<string>();

  forDate90Bookings: AllBookingsForDate[] = [];
  forDate30Bookings: AllBookingsForDate[] = [];
  selectedTabIndex: number = 0;
  forCity: string = '';
  citiesPermission: boolean = false;
  private bookingsSubscription: Subscription | undefined;
  dashboardCity: string = '';
  dashBookings: Booking[] = [];
  dashboardData: DashboardBookings[] = [];

  constructor(private bookingService: BookingService, private router: Router, private authService: AuthService) {}


  ngOnInit(): void {
    console.log('BookingsListComponent initialized');
    this.forCity = this.authService.getForCity() ?? '';
    this.citiesPermission = this.authService.isAdmin();
    this.dashboardCity = this.authService.getForCity() ?? '';
    this.getBookings();
    this.getBookingsForDashboardCity();
  }

  ngOnDestroy(): void {
    if (this.bookingsSubscription) {
      this.bookingsSubscription.unsubscribe();
    }
  }

  onCityChange(city: string): void {
    console.log("1. dashboardData: ", this.dashboardCity);
    this.forCity = city;
    this.cityChange.emit(city);
    this.bookingService.setForCity(city);
    console.log("2. dashboardData: ", this.dashboardCity);
  }

  getBookings(): void {
    this.bookingsSubscription = this.bookingService.allBookings$.subscribe({
      next: (bookings: Booking[]) => {
        let filteredBookings: Booking[] = bookings;
        if (this.forCity && this.forCity !== 'All') {
          filteredBookings = bookings.filter(booking => booking.city === this.forCity);
        }
        this.getAllBookingsForDate(filteredBookings);
      },
      error: (e: any) => console.error(e)
    });
  }

  getAllBookingsForDate(bookings: Booking[]): void {
    const forDate90BookingsMap: Map<string, AllBookingsForDate> = new Map();
    bookings.forEach(booking => {
      if (booking.date) {
        const bookingDate = new Date(booking.date);
        const formattedDate = this.formatDateFrontend(bookingDate);
        const dayOfWeek = this.getDayOfWeekFrontend(bookingDate);

        const existingBooking = forDate90BookingsMap.get(formattedDate);

        if (existingBooking) {
          existingBooking.totalPeople += booking.total_people || 0;
        } else {
          forDate90BookingsMap.set(formattedDate, {
            dayOfWeek: dayOfWeek,
            dateOfBookings: formattedDate,
            totalPeople: booking.total_people || 0
          });
        }
      }
    });
    this.forDate90Bookings = Array.from(forDate90BookingsMap.values());
    this.forDate30Bookings = this.filter30days(this.forDate90Bookings);

    console.log("90 days: ", this.forDate90Bookings);
    console.log("30 days: ", this.forDate30Bookings);
  }

  formatDateFrontend(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  getDayOfWeekFrontend(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = date.getDay();
    return days[dayIndex];
  }
  getMonthName(month: number): string {
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    return months[month - 1];
  }

  filter30days(bookings: AllBookingsForDate[]): AllBookingsForDate[] {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Jučerašnji datum
    const next30Days = new Date(yesterday);
    next30Days.setDate(yesterday.getDate() + 30);
    return bookings.filter(booking => {
      const bookingDateParts = booking.dateOfBookings.split('-').map(Number);
      const bookingDate = new Date(bookingDateParts[2], bookingDateParts[1] - 1, bookingDateParts[0]);
      return bookingDate >= yesterday && bookingDate <= next30Days;
    });
  }


  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  getObjectValues(obj: any, key: string): any {
    return obj[key];
  }

  onTabChange(event: any) {
    this.selectedTabIndex = event.index;
    event.preventDefault();
  }

  onRowClick(date: string, city: string): void {
    this.router.navigate(['/bookings', date, city]);
  }
  getBookingsForDashboardCity(): void {
    this.bookingsSubscription = this.bookingService.allBookings$.subscribe({
      next: (bookings: Booking[]) => {
        let filteredBookings: Booking[] = bookings;
        if (this.dashboardCity && this.dashboardCity !== 'All') {
          filteredBookings = bookings.filter(booking => booking.city === this.dashboardCity);
        }
        // Kreiramo kopiju filtriranih rezervacija
        this.dashBookings = [...filteredBookings];
        this.getFirstNextDateBookings();
      },
      error: (e: any) => console.error(e)
    });
  }

  getFirstNextDateBookings(): void {
    this.dashboardData = [];
    const firstBooking = this.dashBookings[0];
    if (!firstBooking || !firstBooking.date) {
      console.error('Nema dostupnih bookinga ili nema datuma za prvi booking.');
      return;
    }
    const firstBookingDate = new Date(firstBooking.date);
    const monthName = this.getMonthName(firstBookingDate.getMonth() + 1);
    const bookingsForFirstDate = this.dashBookings.filter((booking: Booking) => {
      return booking.date === firstBooking.date;
    });
    const cityData: CityData[] = bookingsForFirstDate.reduce((acc: CityData[], booking: Booking) => {
      const existingCityIndex = acc.findIndex((item: CityData) => item.city === booking.city);
      if (existingCityIndex !== -1) {
        acc[existingCityIndex].totalPeople += booking.total_people || 0;
      } else {
        acc.push({ city: booking.city || '', totalPeople: booking.total_people || 0 });
      }
      return acc;
    }, []);
    this.dashboardData.push({
      dayInWeek: this.getDayOfWeekFrontend(firstBookingDate),
      bookingsDate: this.formatDateFrontend(firstBookingDate),
      dateMonth: monthName,
      cityData: cityData
    });
    console.log(this.dashboardData);
  }

}
