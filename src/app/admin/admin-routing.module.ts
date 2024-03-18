import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
console.log('AdminRoutingModule is loaded');
import { AddBookingComponent } from './components/booking/add-booking/add-booking.component';
import { UpdateBookingComponent } from './components/booking/update-booking/update-booking.component';
import { BookingsListComponent } from './components/booking/bookings-list/bookings-list.component';
import { BookingsDetailsComponent } from './components/booking/bookings-details/bookings-details.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { UsersComponent } from './components/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { CityAccessGuard } from './guard/city.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'bookings', component: BookingsListComponent, canActivate: [AuthGuard] },
  { path: 'add', component: AddBookingComponent, canActivate: [AuthGuard] },
  { path: 'bookings/:date/:city', component: BookingsDetailsComponent, canActivate: [AuthGuard, CityAccessGuard] },
  { path: 'bookings/:date/:city/:id', component: UpdateBookingComponent, canActivate: [AuthGuard, CityAccessGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard, CityAccessGuard] },
  { path: 'statistics', component: StatisticsComponent, canActivate: [AuthGuard, CityAccessGuard] },
  { path: '', redirectTo: 'bookings', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule implements OnInit {
  ngOnInit() {
    console.log('AdminRoutingModule initialized');
    console.log('Routes:', routes);
  }
}
