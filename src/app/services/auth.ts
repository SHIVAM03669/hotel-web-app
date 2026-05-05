import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresAtEpochSecond: number;
  username: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthSession {
  token: string;
  username: string;
  role: 'ADMIN' | 'USER';
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly baseUrl = 'http://localhost:8082/api/auth';
  private readonly tokenKey = 'hotel_auth_token';
  private readonly userKey = 'hotel_auth_user';
  private readonly roleKey = 'hotel_auth_role';

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, { username, password })
      .pipe(tap((response) => this.persistSession(response)));
  }

  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }

    return this.http
      .get<{ valid: boolean }>(`${this.baseUrl}/validate`, {
        headers: this.authHeaders(token),
      })
      .pipe(map((res) => Boolean(res.valid)));
  }

  logout(): void {
    const token = this.getToken();
    if (token) {
      this.http
        .post(`${this.baseUrl}/logout`, null, { headers: this.authHeaders(token) })
        .subscribe({ error: () => undefined });
    }
    this.removeItem(this.tokenKey);
    this.removeItem(this.userKey);
    this.removeItem(this.roleKey);
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  isAdmin(): boolean {
    return this.getItem(this.roleKey) === 'ADMIN';
  }

  getSession(): AuthSession | null {
    const token = this.getToken();
    const username = this.getItem(this.userKey);
    const role = this.getItem(this.roleKey) as 'ADMIN' | 'USER' | null;
    if (!token || !username || !role) {
      return null;
    }
    return { token, username, role };
  }

  private getToken(): string | null {
    return this.getItem(this.tokenKey);
  }

  private persistSession(response: LoginResponse): void {
    this.setItem(this.tokenKey, response.token);
    this.setItem(this.userKey, response.username);
    this.setItem(this.roleKey, response.role);
  }

  private authHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  private getItem(key: string): string | null {
    if (typeof globalThis.localStorage === 'undefined') {
      return null;
    }
    return globalThis.localStorage.getItem(key);
  }

  private setItem(key: string, value: string): void {
    if (typeof globalThis.localStorage === 'undefined') {
      return;
    }
    globalThis.localStorage.setItem(key, value);
  }

  private removeItem(key: string): void {
    if (typeof globalThis.localStorage === 'undefined') {
      return;
    }
    globalThis.localStorage.removeItem(key);
  }
}
