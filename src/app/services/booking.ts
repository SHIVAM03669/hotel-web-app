import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BookingRequest {
  hotelId: number;
  guestName: string;
  guestEmail: string;
  checkInDate: string;
  checkOutDate: string;
  roomsBooked: number;
}

export interface BookingModel {
  bookingId: number;
  hotelId: number;
  hotelName: string;
  guestName: string;
  guestEmail: string;
  checkInDate: string;
  checkOutDate: string;
  roomsBooked: number;
  totalPrice: number;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class Booking {
  private readonly baseUrl = 'http://localhost:8081/api/bookings';

  constructor(private readonly http: HttpClient) {}

  createBooking(payload: BookingRequest): Observable<BookingModel> {
    return this.http.post<BookingModel>(this.baseUrl, payload);
  }

  getBookings(guestEmail: string): Observable<BookingModel[]> {
    return this.http.get<BookingModel[]>(
      `${this.baseUrl}?guestEmail=${encodeURIComponent(guestEmail)}`,
    );
  }

  cancelBooking(id: number): Observable<BookingModel> {
    return this.http.put<BookingModel>(`${this.baseUrl}/${id}/cancel`, null);
  }
}
