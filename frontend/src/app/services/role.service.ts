import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/roles`;

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }

  createRole(role: Role): Observable<void> {
    return this.http.post<void>(this.apiUrl, role);
  }

  updateRole(id: number, role: Role): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  assignPermission(roleId: number, permissionId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${roleId}/permissions/${permissionId}`, {});
  }

  revokePermission(roleId: number, permissionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${roleId}/permissions/${permissionId}`);
  }

  updateRolePermissions(roleId: number, permissionIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${roleId}/permissions`, permissionIds);
  }
}
