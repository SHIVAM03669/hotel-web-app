import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';

export interface HotelModel {
  id: number;
  name: string;
  city: string;
  address: string;
  description: string;
  pricePerNight: number;
  totalRooms: number;
  availableRooms: number;
  active: boolean;
}

export interface HotelPage {
  content: HotelModel[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

type HotelResponse = HotelPage | HotelModel[];

@Injectable({
  providedIn: 'root',
})
export class Hotel {
  private readonly baseUrl = 'http://localhost:8081/api/hotels';
  private readonly cache = new Map<string, HotelPage>();

  constructor(private readonly http: HttpClient) {}

  getHotels(page = 0, size = 10, city?: string, forceRefresh = false): Observable<HotelPage> {
    const normalizedCity = city?.trim().toLowerCase() ?? '';
    const cacheKey = `${normalizedCity}::${page}::${size}`;
    if (!forceRefresh && this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey)!);
    }

    const cityQuery = city?.trim() ? `&city=${encodeURIComponent(city.trim())}` : '';
    return this.http
      .get<HotelResponse>(`${this.baseUrl}?page=${page}&size=${size}${cityQuery}`)
      .pipe(
        map((res) => this.normalizeToPage(res, page, size)),
        tap((res) => this.cache.set(cacheKey, res)),
      );
  }

  getHotelById(id: number): Observable<HotelModel> {
    return this.http.get<HotelModel>(`${this.baseUrl}/${id}`);
  }

  clearCache(): void {
    this.cache.clear();
  }

  private normalizeToPage(response: HotelResponse, page: number, size: number): HotelPage {
    if (Array.isArray(response)) {
      const start = page * size;
      const content = response.slice(start, start + size);
      const totalElements = response.length;
      const totalPages = Math.max(1, Math.ceil(totalElements / size));
      const last = page >= totalPages - 1;
      return {
        content,
        totalElements,
        totalPages,
        number: page,
        size,
        first: page === 0,
        last,
      };
    }
    return response;
  }
}
