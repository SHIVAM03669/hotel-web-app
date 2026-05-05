import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Hotel, HotelModel } from '../../services/hotel';
import { Booking } from '../../services/booking';
import { Auth } from '../../services/auth';
import { SkeletonScreen } from '../skeleton-screen/skeleton-screen';

@Component({
  selector: 'app-hotel-list',
  imports: [FormsModule, SkeletonScreen],
  templateUrl: './hotel-list.html',
  standalone: true,
})
export class HotelList {
  hotels: HotelModel[] = [];
  loadingHotels = false;
  loadingMoreHotels = false;
  hasSearched = false;
  currentPage = 0;
  readonly pageSize = 10;
  hasMoreHotels = false;
  totalHotels = 0;
  city = '';
  roomsBooked = 1;
  checkInDate = '';
  checkOutDate = '';
  selectedHotelId: number | null = null;
  error = '';
  success = '';

  constructor(
    private readonly hotelService: Hotel,
    private readonly bookingService: Booking,
    private readonly auth: Auth,
  ) {}

  loadHotels(reset = true): void {
    if (reset) {
      this.currentPage = 0;
      this.hotels = [];
      this.hasMoreHotels = false;
      this.totalHotels = 0;
      this.hasSearched = true;
      this.loadingHotels = true;
    } else {
      this.loadingMoreHotels = true;
    }
    this.error = '';
    this.hotelService.getHotels(this.currentPage, this.pageSize, this.city).subscribe({
      next: (data) => {
        this.hotels = reset ? data.content : [...this.hotels, ...data.content];
        this.totalHotels = data.totalElements;
        this.hasMoreHotels = !data.last;
        this.currentPage = data.number + 1;
        this.loadingHotels = false;
        this.loadingMoreHotels = false;
      },
      error: () => {
        this.error = 'Could not load hotels';
        this.loadingHotels = false;
        this.loadingMoreHotels = false;
      },
    });
  }

  searchHotels(): void {
    this.hotelService.clearCache();
    this.loadHotels(true);
  }

  loadMoreHotels(): void {
    if (this.loadingHotels || this.loadingMoreHotels || !this.hasMoreHotels) {
      return;
    }
    this.loadHotels(false);
  }

  selectHotel(id: number): void {
    this.selectedHotelId = id;
    this.success = '';
    this.error = '';
  }

  createBooking(): void {
    if (!this.selectedHotelId) {
      this.error = 'Please select a hotel';
      return;
    }
    if (!this.checkInDate || !this.checkOutDate) {
      this.error = 'Please select both check-in and check-out dates';
      this.success = '';
      return;
    }
    if (new Date(this.checkOutDate) <= new Date(this.checkInDate)) {
      this.error = 'Check-out date must be after check-in date';
      this.success = '';
      return;
    }
    if (!Number.isInteger(this.roomsBooked) || this.roomsBooked < 1) {
      this.error = 'Rooms booked must be at least 1';
      this.success = '';
      return;
    }

    const session = this.auth.getSession();
    if (!session) {
      this.error = 'Please login first';
      return;
    }

    this.bookingService
      .createBooking({
        hotelId: this.selectedHotelId,
        guestName: session.username,
        guestEmail: `${session.username}@demo.local`,
        checkInDate: this.checkInDate,
        checkOutDate: this.checkOutDate,
        roomsBooked: this.roomsBooked,
      })
      .subscribe({
        next: (res) => {
          this.success = `Booking confirmed (#${res.bookingId})`;
          this.error = '';
          const bookedRooms = this.roomsBooked;
          const selectedHotelId = this.selectedHotelId!;
          this.hotels = this.hotels.map((hotel) =>
            hotel.id === selectedHotelId
              ? { ...hotel, availableRooms: Math.max(0, hotel.availableRooms - bookedRooms) }
              : hotel,
          );

          // Keep UI fully in sync with backend after optimistic update.
          this.hotelService.getHotelById(selectedHotelId).subscribe({
            next: (updatedHotel) => {
              this.hotels = this.hotels.map((hotel) =>
                hotel.id === updatedHotel.id ? updatedHotel : hotel,
              );
            },
            error: () => undefined,
          });
          this.hotelService.clearCache();
        },
        error: (err) => {
          if (typeof err?.error?.message === 'string') {
            this.error = err.error.message;
          } else if (err?.status === 400) {
            this.error =
              'Invalid booking request. Please verify dates, rooms, and selected hotel availability.';
          } else {
            this.error = 'Booking failed';
          }
          this.success = '';
        },
      });
  }
}
