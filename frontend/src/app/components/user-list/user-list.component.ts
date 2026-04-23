import { 
  Component, 
  ChangeDetectionStrategy, 
  signal, 
  computed, 
  inject, 
  afterNextRender, 
  effect,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { PermissionService } from '../../services/permission.service';
import { PageRequest } from '../../models/pagination.model';

import { TranslatePipe } from '../../translate.pipe';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  readonly permissionService = inject(PermissionService);

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
    role: ['all']
  });

  // --- User create/edit form ---
  readonly userForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    enabled: [true],
    role: ['USER']
  });

  // --- Computed ---
  readonly roleOptions = computed<string[]>(() => {
    const dynamic = this.users()
      .flatMap(u => (u.roles ?? []).map(r => r.name))
      .filter(Boolean);
    return [...new Set(['ADMIN', 'MANAGER', 'USER', ...dynamic])];
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalElements() / this.pageSize()))
  );

  readonly paginatedUsers = computed(() => this.users());

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

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

    // No auto-search on valueChanges to support manual search trigger

  }

  // --- Data ---
  loadUsers(): void {
    const { search } = this.filterForm.value;
    const request: PageRequest = {
      page: this.currentPage(),
      size: this.pageSize()
    };

    this.userService.getPagedUsers(request, search).subscribe(response => {
      this.users.set(response.content);
      this.totalElements.set(response.totalElements);
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
    this.currentPage.set(1);
  }

  // --- Pagination ---
  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(0);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page - 1);
    }
  }

  // --- CRUD ---
  openCreatePopup(): void {
    if (!this.permissionService.canCreate('users')) return;

    this.isEditMode.set(false);
    this.activeUserId.set(null);
    this.clearMessages();
    this.userForm.reset({ username: '', email: '', password: '', enabled: true, role: 'USER' });
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
      role: user.roles?.[0]?.name ?? 'USER'
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

    const { username, email, password, enabled, role } = this.userForm.getRawValue();
    const trimmed = {
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
      role: role || 'USER'
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
      roles: [{ name: trimmed.role }],
      ...(trimmed.password ? { password: trimmed.password } : {})
    };

    const request$ = editing && this.activeUserId()
      ? this.userService.updateUser(this.activeUserId()!, payload)
      : this.userService.createUser(payload);

    request$.subscribe({
      next: () => {
        this.closePopup();
        this.loadUsers();
      },
      error: () => this.setError(editing ? 'Failed to update user.' : 'Failed to create user.')
    });
  }

  toggleUser(user: User): void {
    if (!this.permissionService.canUpdate('users')) return;

    this.userService.updateUser(user.id!, user).subscribe({
      error: () => { user.enabled = !user.enabled; }
    });
  }

  deleteUser(id: number): void {
    if (!this.permissionService.canDelete('users')) return;

    this.userService.deleteUser(id).subscribe(() => this.loadUsers());
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
    const total = this.totalPages();
    this.currentPage.update(page => Math.max(0, Math.min(page, total - 1)));
  }
}
