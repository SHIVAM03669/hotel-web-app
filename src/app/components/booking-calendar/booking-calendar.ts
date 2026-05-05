import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Booking, BookingModel } from '../../services/booking';
import { SkeletonScreen } from '../skeleton-screen/skeleton-screen';

@Component({
  selector: 'app-booking-calendar',
  imports: [FormsModule, SkeletonScreen],
  templateUrl: './booking-calendar.html',
  standalone: true,
})
export class BookingCalendar {
  bookings: BookingModel[] = [];
  loadingBookings = false;
  error = '';

  constructor(
    private readonly bookingService: Booking,
    private readonly auth: Auth,
  ) {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loadingBookings = true;
    const session = this.auth.getSession();
    if (!session) {
      this.error = 'Please login first';
      this.loadingBookings = false;
      return;
    }

    this.bookingService.getBookings(`${session.username}@demo.local`).subscribe({
      next: (data) => {
        this.bookings = data;
        this.error = '';
        this.loadingBookings = false;
      },
      error: () => {
        this.error = 'Could not fetch bookings';
        this.loadingBookings = false;
      },
    });
  }

  cancelBooking(id: number): void {
    this.bookingService.cancelBooking(id).subscribe({
      next: () => this.loadBookings(),
      error: () => (this.error = 'Failed to cancel booking'),
    });
  }
}
