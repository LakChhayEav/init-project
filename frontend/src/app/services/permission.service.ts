import { Injectable, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';

export type AppFeature = 'main' | 'tasks' | 'users' | 'permissions';
export type AppCapability = 'view' | 'create' | 'update' | 'delete';

export interface RolePolicy {
  role: string;
  permissions: Partial<Record<AppFeature, AppCapability[]>>;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private readonly authService = inject(AuthService);

  readonly policies = signal<RolePolicy[]>([
    {
      role: 'ADMIN',
      permissions: {
        main: ['view', 'create', 'update', 'delete'],
        tasks: ['view', 'create', 'update', 'delete'],
        users: ['view', 'create', 'update', 'delete'],
        permissions: ['view', 'create', 'update', 'delete']
      }
    },
    {
      role: 'MANAGER',
      permissions: {
        main: ['view'],
        tasks: ['view', 'create', 'update'],
        users: ['view', 'create', 'update'],
        permissions: ['view']
      }
    },
    {
      role: 'USER',
      permissions: {
        main: ['view'],
        tasks: ['view'],
        users: ['view']
      }
    },
    {
      role: 'VIEWER',
      permissions: {
        main: ['view'],
        tasks: ['view'],
        users: ['view']
      }
    }
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
    return userRoles.some(r => {
      const policy = this.policies().find(p => p.role.toUpperCase() === r.toUpperCase());
      const caps = policy?.permissions[feature] ?? [];
      return caps.includes(capability);
    });
  }

  updatePolicy(updatedPolicy: RolePolicy): void {
    this.policies.update(all => all.map(p => p.role === updatedPolicy.role ? updatedPolicy : p));
  }
}
