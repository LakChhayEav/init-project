import { Injectable, inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  username: string;
  roles?: string[];
  passwordResetRequired: boolean;
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
  readonly passwordResetRequired = signal<boolean>(false);

  readonly isLoggedIn = computed(() => !!this.token());

  constructor() {
    if (this.isBrowser) {
      // Sync with session storage on init
      this.token.set(sessionStorage.getItem('token'));
      this.usernameSignal.set(sessionStorage.getItem('username'));
      this.passwordResetRequired.set(sessionStorage.getItem('resetRequired') === 'true');

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
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      map(res => res.data),
      tap((response) => {
        if (response.token) {
          const roles = response.roles?.length ? response.roles : ['USER'];

          if (this.isBrowser) {
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('username', response.username);
            sessionStorage.setItem('roles', JSON.stringify(roles));
            sessionStorage.setItem('resetRequired', String(response.passwordResetRequired));
          }

          this.token.set(response.token);
          this.usernameSignal.set(response.username);
          this.rolesSignal.set(roles);
          this.passwordResetRequired.set(response.passwordResetRequired);
        }
      }),
    );
  }

  changePassword(newPassword: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/change-password`, { newPassword }).pipe(
      map(res => res.data),
      tap(() => {
        this.passwordResetRequired.set(false);
        if (this.isBrowser) {
          sessionStorage.setItem('resetRequired', 'false');
        }
      })
    );
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
