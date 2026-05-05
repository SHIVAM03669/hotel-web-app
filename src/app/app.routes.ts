import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { HotelList } from './components/hotel-list/hotel-list';
import { BookingCalendar } from './components/booking-calendar/booking-calendar';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'hotels', component: HotelList, canActivate: [authGuard] },
  { path: 'bookings', component: BookingCalendar, canActivate: [authGuard] },
  {
    path: 'admin',
    component: AdminDashboard,
    canActivate: [authGuard],
    data: { adminOnly: true },
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
