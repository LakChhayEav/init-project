import { Component, ChangeDetectionStrategy, signal, computed, inject, afterNextRender } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { PermissionService } from '../../services/permission.service';
import { Task } from '../../models/task.model';

interface DashboardUser {
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Pending';
}

import { TranslatePipe } from '../../translate.pipe';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent {
  readonly authService = inject(AuthService);
  readonly permissionService = inject(PermissionService);
  private readonly taskService = inject(TaskService);
  private readonly fb = inject(FormBuilder);

  // --- State ---
  readonly isSubmitting = signal(false);
  readonly formMessage = signal('');
  readonly formError = signal(false);
  readonly isUserPopupOpen = signal(false);
  readonly userMessage = signal('');
  readonly userFormError = signal(false);

  readonly dashboardUsers = signal<DashboardUser[]>([
    { name: 'Sophia Kim', email: 'sophia.kim@example.com', role: 'Admin', status: 'Active' },
    { name: 'David Lee', email: 'david.lee@example.com', role: 'Manager', status: 'Active' },
    { name: 'Ava Patel', email: 'ava.patel@example.com', role: 'Viewer', status: 'Pending' }
  ]);

  readonly userRoles = ['Admin', 'Manager', 'Viewer'] as const;

  // --- Forms ---
  readonly taskForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['']
  });

  readonly userForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['Viewer']
  });

  // --- Computed ---
  readonly totalUsers = computed(() => this.dashboardUsers().length);
  readonly activeUsers = computed(() => this.dashboardUsers().filter(u => u.status === 'Active').length);
  readonly pendingUsers = computed(() => this.dashboardUsers().filter(u => u.status === 'Pending').length);

  // --- User popup ---
  openUserPopup(): void {
    if (!this.permissionService.canCreate('users')) return;

    this.isUserPopupOpen.set(true);
    this.userMessage.set('');
    this.userFormError.set(false);
    this.userForm.reset({ name: '', email: '', role: 'Viewer' });
  }

  closeUserPopup(): void {
    this.isUserPopupOpen.set(false);
  }

  submitUserForm(): void {
    if (!this.permissionService.canCreate('users')) return;

    const { name, email, role } = this.userForm.getRawValue();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName || !trimmedEmail || !emailPattern.test(trimmedEmail)) {
      this.userMessage.set('Please provide a valid name, email, and role.');
      this.userFormError.set(true);
      return;
    }

    this.dashboardUsers.update(users => [
      { name: trimmedName, email: trimmedEmail, role: role.trim(), status: 'Active' as const },
      ...users
    ]);

    this.userForm.reset({ name: '', email: '', role: 'Viewer' });
    this.userMessage.set('User added successfully.');
    this.userFormError.set(false);
    this.isUserPopupOpen.set(false);
  }

  addUserFromPopup(name: string, email: string): void {
    if (!name.trim() || !email.trim()) {
      this.userMessage.set('Please provide both name and email.');
      this.userFormError.set(true);
      return;
    }

    this.dashboardUsers.update(users => [
      { name: name.trim(), email: email.trim(), role: 'User', status: 'Active' as const },
      ...users
    ]);
    
    this.userMessage.set('User added successfully.');
    this.userFormError.set(false);
    setTimeout(() => this.closeUserPopup(), 1000);
  }

  // --- Task form ---
  submitMainForm(): void {
    if (!this.permissionService.canCreate('tasks') || this.isSubmitting()) return;

    const { title, description } = this.taskForm.getRawValue();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    this.isSubmitting.set(true);
    this.formMessage.set('');
    this.formError.set(false);

    const taskToCreate: Task = {
      title: trimmedTitle,
      description: description?.trim() ?? '',
      completed: false
    };

    this.taskService.createTask(taskToCreate).subscribe({
      next: () => {
        this.taskForm.reset({ title: '', description: '' });
        this.formMessage.set('Task created successfully.');
        this.formError.set(false);
        this.isSubmitting.set(true);
        this.isSubmitting.set(false);
      },
      error: () => {
        this.formMessage.set('Unable to submit form. Please try again.');
        this.formError.set(true);
        this.isSubmitting.set(false);
      }
    });
  }
}
