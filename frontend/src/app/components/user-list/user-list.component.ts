import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  afterNextRender,
  effect,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { PermissionService } from '../../services/permission.service';
import { ConfirmService } from '../../services/confirm.service';
import { AuthService } from '../../services/auth.service';
import { PageRequest } from '../../models/pagination.model';

import { TranslatePipe } from '../../translate.pipe';
import { TableModule } from '../shared/table/table.module';
import { TableColumn } from '../shared/table/table.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule, TranslatePipe, TableModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  readonly permissionService = inject(PermissionService);
  private readonly confirmService = inject(ConfirmService);
  private readonly authService = inject(AuthService);

  // --- State ---
  readonly users = signal<User[]>([]);
  readonly isPopupOpen = signal(false);
  readonly isEditMode = signal(false);
  readonly activeUserId = signal<number | null>(null);
  readonly actionMessage = signal('');
  readonly actionError = signal(false);
  readonly totalElements = signal(0);
  readonly currentPage = signal(0); // 0-indexed for backend
  readonly pageSize = signal(5);
  readonly pageSizeOptions = [5, 10, 20, 50, 100];

  // --- Filter form (reactive) ---
  readonly filterForm = this.fb.nonNullable.group({
    search: [''],
    status: ['all' as 'all' | 'active' | 'inactive'],
    role: ['all'],
  });

  // --- User create/edit form ---
  readonly userForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    enabled: [true],
    roles: [['USER']],
    passwordResetRequired: [true],
  });

  readonly columns: TableColumn[] = [
    { key: 'username', label: 'user.username' },
    { key: 'enabled', label: 'common.status' },
    { key: 'roles', label: 'user.roles' },
    { key: 'createdDate', label: 'common.created_date' },
    { key: 'updatedDate', label: 'common.updated_date' },
    { key: 'actions', label: 'common.actions', align: 'right' },
  ];

  // --- Computed ---
  readonly roleOptions = computed<string[]>(() => {
    const dynamic = this.users()
      .flatMap((u) => (u.roles ?? []).map((r) => r.name))
      .filter(Boolean);
    return [...new Set(['ADMIN', 'MANAGER', 'USER', ...dynamic])];
  });

  constructor() {
    afterNextRender(() => {
      this.loadUsers();
    });

    // Refetch when page or size changes (Browser only to avoid SSR 403)
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      effect(() => {
        this.loadUsers();
      });
    }
  }

  // --- Data ---
  loadUsers(): void {
    const { search } = this.filterForm.value;
    const request: PageRequest = {
      page: this.currentPage(),
      size: this.pageSize(),
    };

    this.userService.getPagedUsers(request, search).subscribe((response) => {
      this.users.set(response.data);
      if (response.pagination) {
        this.totalElements.set(response.pagination.totalElements);
      }
      this.normalizeCurrentPage();
    });
  }

  // --- Filters ---
  search(): void {
    this.currentPage.set(0);
    this.loadUsers();
  }

  onFilterChange(): void {
    this.search();
  }

  resetFilters(): void {
    this.filterForm.reset({ search: '', status: 'all', role: 'all' });
    this.currentPage.set(0);
  }

  // --- Pagination ---
  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(0);
  }

  goToPage(page: number): void {
    this.currentPage.set(page - 1);
  }

  // --- CRUD ---
  openCreatePopup(): void {
    if (!this.permissionService.canCreate('users')) return;

    this.isEditMode.set(false);
    this.activeUserId.set(null);
    this.clearMessages();
    this.userForm.reset({ username: '', email: '', password: '', enabled: true, roles: ['USER'], passwordResetRequired: true });
    this.isPopupOpen.set(true);
  }

  openEditPopup(user: User): void {
    if (!this.permissionService.canUpdate('users')) return;

    this.isEditMode.set(true);
    this.activeUserId.set(user.id ?? null);
    this.clearMessages();
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      password: '',
      enabled: user.enabled,
      roles: user.roles?.map(r => r.name) ?? ['USER'],
      passwordResetRequired: user.passwordResetRequired ?? false,
    });
    this.isPopupOpen.set(true);
  }

  closePopup(): void {
    this.isPopupOpen.set(false);
  }

  submitUserForm(): void {
    const editing = this.isEditMode();
    if (editing && !this.permissionService.canUpdate('users')) return;
    if (!editing && !this.permissionService.canCreate('users')) return;

    const { username, email, password, enabled, roles, passwordResetRequired } = this.userForm.getRawValue();
    const trimmed = {
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
      roles: roles && roles.length > 0 ? roles : ['USER'],
      passwordResetRequired: !!passwordResetRequired
    };

    if (!trimmed.username || !trimmed.email) {
      this.setError('Username and email are required.');
      return;
    }

    if (!editing && !trimmed.password) {
      this.setError('Password is required when creating a user.');
      return;
    }

    const payload: User = {
      username: trimmed.username,
      email: trimmed.email,
      enabled: !!enabled,
      roles: trimmed.roles.map(r => ({ name: r })),
      passwordResetRequired: trimmed.passwordResetRequired,
      ...(trimmed.password ? { password: trimmed.password } : {}),
      updatedBy: this.authService.username ?? 'system',
      updatedDate: new Date().toISOString(),
    };

    const executeRequest = () => {
      const request$ =
        editing && this.activeUserId()
          ? this.userService.updateUser(this.activeUserId()!, payload)
          : this.userService.createUser(payload);

      request$.subscribe({
        next: () => {
          this.closePopup();
          this.loadUsers();
        },
        error: () => this.setError(editing ? 'Failed to update user.' : 'Failed to create user.'),
      });
    };

    if (editing) {
      this.confirmService.open({
        title: 'confirm.user.update.title',
        message: 'confirm.user.update.message',
        confirmText: 'common.save',
        onConfirm: executeRequest
      });
    } else {
      executeRequest();
    }
  }

  toggleUser(user: User): void {
    if (!this.permissionService.canUpdate('users')) return;

    this.confirmService.open({
      title: 'confirm.user.status.title',
      message: 'confirm.user.status.message',
      confirmText: 'common.save',
      onConfirm: () => {
        const updatedUser = { 
          ...user, 
          enabled: !user.enabled,
          updatedBy: this.authService.username ?? 'system',
          updatedDate: new Date().toISOString()
        };
        this.userService.updateUser(user.id!, updatedUser).subscribe({
          next: (serverUser) => {
            // Update the signal with the server-returned user to reflect new audit fields (updatedBy, updatedDate)
            this.users.update(users => users.map(u => u.id === user.id ? serverUser : u));
          },
          error: () => {
            // On error, the UI remains in the previous state because we didn't update the signal yet
          },
        });
      },
      onCancel: () => {
        // Do nothing, UI stays in the current state
      }
    });
  }

  deleteUser(id: number): void {
    if (!this.permissionService.canDelete('users')) return;

    this.confirmService.open({
      title: 'confirm.user.delete.title',
      message: 'confirm.user.delete.message',
      confirmText: 'common.delete',
      onConfirm: () => {
        this.userService.deleteUser(id).subscribe(() => this.loadUsers());
      }
    });
  }

  // --- Helpers ---
  private clearMessages(): void {
    this.actionMessage.set('');
    this.actionError.set(false);
  }

  private setError(message: string): void {
    this.actionMessage.set(message);
    this.actionError.set(true);
  }

  private normalizeCurrentPage(): void {
    const total = Math.max(1, Math.ceil(this.totalElements() / this.pageSize()));
    this.currentPage.update((page) => Math.max(0, Math.min(page, total - 1)));
  }
}
