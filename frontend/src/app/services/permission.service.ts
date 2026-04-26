import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { Permission } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

export type AppFeature = 'main' | 'tasks' | 'users' | 'permissions' | 'change-password';
export type AppCapability = 'view' | 'create' | 'update' | 'delete';

export interface RolePolicy {
  role: string;
  permissions: Partial<Record<AppFeature, AppCapability[]>>;
}

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/permissions`;

  getAllPermissions(): Observable<Permission[]> {
    return this.http.post<ApiResponse<Permission[]>>(`${this.apiUrl}/search`, {}).pipe(
      map(res => res.data)
    );
  }

  readonly policies = signal<RolePolicy[]>([
    {
      role: 'ADMIN',
      permissions: {
        main: ['view', 'create', 'update', 'delete'],
        tasks: ['view', 'create', 'update', 'delete'],
        users: ['view', 'create', 'update', 'delete'],
        permissions: ['view', 'create', 'update', 'delete'],
        'change-password': ['view'],
      },
    },
    {
      role: 'MANAGER',
      permissions: {
        main: ['view'],
        tasks: ['view', 'create', 'update'],
        users: ['view', 'create', 'update'],
        permissions: ['view'],
        'change-password': ['view'],
      },
    },
    {
      role: 'USER',
      permissions: {
        main: ['view'],
        tasks: ['view'],
        users: ['view'],
        'change-password': ['view'],
      },
    },
    {
      role: 'VIEWER',
      permissions: {
        main: ['view'],
        tasks: ['view'],
        users: ['view'],
        'change-password': ['view'],
      },
    },
  ]);

  canView(feature: AppFeature): boolean {
    return this.has(feature, 'view');
  }

  canCreate(feature: AppFeature): boolean {
    return this.has(feature, 'create');
  }

  canUpdate(feature: AppFeature): boolean {
    return this.has(feature, 'update');
  }

  canDelete(feature: AppFeature): boolean {
    return this.has(feature, 'delete');
  }

  private has(feature: AppFeature, capability: AppCapability): boolean {
    const userRoles = this.authService.roles;
    return userRoles.some((r) => {
      const policy = this.policies().find((p) => p.role.toUpperCase() === r.toUpperCase());
      const caps = policy?.permissions[feature] ?? [];
      return caps.includes(capability);
    });
  }

  updatePolicy(updatedPolicy: RolePolicy): void {
    this.policies.update((all) =>
      all.map((p) => (p.role === updatedPolicy.role ? updatedPolicy : p)),
    );
  }
}
