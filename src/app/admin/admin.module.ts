import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddBookingComponent } from './components/booking/add-booking/add-booking.component';
import { BookingsListComponent } from './components/booking/bookings-list/bookings-list.component';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

import { AdminRoutingModule } from './admin-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';


import { BookingsDetailsComponent } from './components/booking/bookings-details/bookings-details.component';
import { UpdateBookingComponent } from './components/booking/update-booking/update-booking.component';
import { UsersComponent } from './components/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { AdminComponent } from './admin.component';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AdminComponent,
    AddBookingComponent,
    BookingsListComponent,
    BookingsDetailsComponent,
    UpdateBookingComponent,
    UsersComponent,
    LoginComponent,
    StatisticsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AdminRoutingModule,
    MatTabsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AdminComponent]
})
export class AdminModule { }
