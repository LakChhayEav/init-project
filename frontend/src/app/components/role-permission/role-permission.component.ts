import { Component, ChangeDetectionStrategy, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PermissionService, AppFeature, AppCapability } from '../../services/permission.service';
import { RoleService } from '../../services/role.service';
import { ConfirmService } from '../../services/confirm.service';
import { Role, Permission } from '../../models/user.model';
import { TranslatePipe } from '../../translate.pipe';

@Component({
  selector: 'app-role-permission',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ReactiveFormsModule],
  templateUrl: './role-permission.component.html',
  styleUrl: './role-permission.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolePermissionComponent {
  readonly permissionService = inject(PermissionService);
  readonly roleService = inject(RoleService);
  readonly confirmService = inject(ConfirmService);
  private readonly fb = inject(FormBuilder);

  readonly features: AppFeature[] = ['main', 'tasks', 'users', 'permissions'];
  readonly capabilities: AppCapability[] = ['view', 'create', 'update', 'delete'];

  readonly roles = signal<Role[]>([]);
  readonly allPermissions = signal<Permission[]>([]);
  
  readonly isPopupOpen = signal(false);
  readonly isEditMode = signal(false);
  readonly activeRoleId = signal<number | null>(null);
  
  readonly hasUnsavedChanges = signal(false);
  private modifiedRoleIds = new Set<number>();

  readonly roleForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  constructor() {
    afterNextRender(() => {
      this.loadData();
    });
  }

  loadData(): void {
    this.hasUnsavedChanges.set(false);
    this.modifiedRoleIds.clear();
    this.permissionService.getAllPermissions().subscribe(perms => this.allPermissions.set(perms));
    this.roleService.getAllRoles().subscribe(roles => this.roles.set(roles));
  }

  hasPermission(role: Role, feature: AppFeature, capability: AppCapability): boolean {
    const permName = `${feature.toUpperCase()}_${capability.toUpperCase()}`;
    return role.permissions?.some(p => p.name === permName) ?? false;
  }

  togglePermission(role: Role, feature: AppFeature, capability: AppCapability, event: Event): void {
    const permName = `${feature.toUpperCase()}_${capability.toUpperCase()}`;
    const permission = this.allPermissions().find(p => p.name === permName);
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    
    if (!permission || !permission.id || !role.id) return;

    this.hasUnsavedChanges.set(true);
    this.modifiedRoleIds.add(role.id);

    if (isChecked) {
      if (!role.permissions) role.permissions = [];
      role.permissions.push(permission);
    } else {
      if (role.permissions) {
        role.permissions = role.permissions.filter(p => p.id !== permission.id);
      }
    }
  }

  savePermissions(): void {
    if (this.modifiedRoleIds.size === 0) return;

    this.confirmService.open({
      title: 'confirm.permission.save.title',
      message: 'confirm.permission.save.message',
      confirmText: 'common.save',
      onConfirm: () => {
        const requests = Array.from(this.modifiedRoleIds).map(roleId => {
          const role = this.roles().find(r => r.id === roleId);
          const permIds = role?.permissions?.map(p => p.id!) ?? [];
          return this.roleService.updateRolePermissions(roleId, permIds);
        });

        forkJoin(requests).subscribe(() => {
          this.loadData();
        });
      }
    });
  }

  openCreatePopup(): void {
    this.isEditMode.set(false);
    this.activeRoleId.set(null);
    this.roleForm.reset({ name: '' });
    this.isPopupOpen.set(true);
  }

  openEditPopup(role: Role): void {
    this.isEditMode.set(true);
    this.activeRoleId.set(role.id ?? null);
    this.roleForm.patchValue({ name: role.name });
    this.isPopupOpen.set(true);
  }

  closePopup(): void {
    this.isPopupOpen.set(false);
  }

  submitRoleForm(): void {
    const { name } = this.roleForm.getRawValue();
    const trimmedName = name.trim().toUpperCase();
    if (!trimmedName) return;

    const payload = { name: trimmedName } as Role;

    const executeRequest = () => {
      const request$ = this.isEditMode() && this.activeRoleId()
        ? this.roleService.updateRole(this.activeRoleId()!, payload)
        : this.roleService.createRole(payload);

      request$.subscribe({
        next: () => {
          this.closePopup();
          this.loadData();
        }
      });
    };

    if (this.isEditMode()) {
      this.confirmService.open({
        title: 'confirm.role.update.title',
        message: 'confirm.role.update.message',
        confirmText: 'common.save',
        onConfirm: executeRequest
      });
    } else {
      executeRequest();
    }
  }

  deleteRole(id: number): void {
    this.confirmService.open({
      title: 'confirm.role.delete.title',
      message: 'confirm.role.delete.message',
      confirmText: 'common.delete',
      onConfirm: () => {
        this.roleService.deleteRole(id).subscribe(() => this.loadData());
      }
    });
  }
}
