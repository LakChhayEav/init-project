import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { PageRequest, PageResponse } from '../models/pagination.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  getUsers(): Observable<User[]> {
    return this.http.post<ApiResponse<User[]>>(`${this.apiUrl}/search`, {}).pipe(
      map(res => res.data)
    );
  }

  getPagedUsers(request: PageRequest, search?: string): Observable<ApiResponse<User[]>> {
    const payload = {
      filter: { search: search || '' },
      pagination: { page: request.page, size: request.size }
    };
    return this.http.post<ApiResponse<User[]>>(`${this.apiUrl}/search`, payload);
  }

  getUser(id: number): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/${id}`, {}).pipe(
      map(res => res.data)
    );
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<ApiResponse<User>>(this.apiUrl, user).pipe(
      map(res => res.data)
    );
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}`, user).pipe(
      map(res => res.data)
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addRoleToUser(userId: number, roleId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/roles/${roleId}`, {});
  }

  removeRoleFromUser(userId: number, roleId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}/roles/${roleId}`);
  }
}
