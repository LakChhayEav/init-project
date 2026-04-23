import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionService, RolePolicy, AppFeature, AppCapability } from '../../services/permission.service';
import { TranslatePipe } from '../../translate.pipe';

@Component({
  selector: 'app-role-permission',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './role-permission.component.html',
  styleUrl: './role-permission.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolePermissionComponent {
  readonly permissionService = inject(PermissionService);

  readonly features: AppFeature[] = ['main', 'tasks', 'users', 'permissions'];
  readonly capabilities: AppCapability[] = ['view', 'create', 'update', 'delete'];

  hasPermission(policy: RolePolicy, feature: AppFeature, capability: AppCapability): boolean {
    return policy.permissions[feature]?.includes(capability) ?? false;
  }

  togglePermission(policy: RolePolicy, feature: AppFeature, capability: AppCapability): void {
    const current = policy.permissions[feature] ?? [];
    let updated: AppCapability[];

    if (current.includes(capability)) {
      updated = current.filter(c => c !== capability);
    } else {
      updated = [...current, capability];
    }

    const newPolicy: RolePolicy = {
      ...policy,
      permissions: {
        ...policy.permissions,
        [feature]: updated
      }
    };

    this.permissionService.updatePolicy(newPolicy);
  }
}
