import { Injectable, inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  username: string;
  roles?: string[];
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // --- Signals ---
  readonly token = signal<string | null>(null);
  readonly usernameSignal = signal<string | null>(null);
  readonly rolesSignal = signal<string[]>([]);

  readonly isLoggedIn = computed(() => !!this.token());

  constructor() {
    if (this.isBrowser) {
      // Sync with session storage on init
      this.token.set(sessionStorage.getItem('token'));
      this.usernameSignal.set(sessionStorage.getItem('username'));

      const rolesRaw = sessionStorage.getItem('roles');
      if (rolesRaw) {
        try {
          this.rolesSignal.set(JSON.parse(rolesRaw));
        } catch {
          this.rolesSignal.set([]);
        }
      }

      // Cleanup old local storage
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('roles');
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.token) {
          const roles = response.roles?.length ? response.roles : ['USER'];

          if (this.isBrowser) {
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('username', response.username);
            sessionStorage.setItem('roles', JSON.stringify(roles));
          }

          this.token.set(response.token);
          this.usernameSignal.set(response.username);
          this.rolesSignal.set(roles);
        }
      }),
    );
  }

  register(userData: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    if (this.isBrowser) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('roles');
    }

    this.token.set(null);
    this.usernameSignal.set(null);
    this.rolesSignal.set([]);
  }

  getToken(): string | null {
    return this.token();
  }

  get username(): string | null {
    return this.usernameSignal();
  }

  get roles(): string[] {
    return this.rolesSignal();
  }
}
