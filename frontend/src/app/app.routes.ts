import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

export const routes: Routes = [
  {
    path: 'change-password',
    component: ChangePasswordComponent,
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent),
  },

  {
    path: 'main',
    loadComponent: () =>
      import('./components/main-page/main-page.component').then((m) => m.MainPageComponent),
    canActivate: [authGuard],
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./components/task-list/task-list.component').then((m) => m.TaskListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./components/user-list/user-list.component').then((m) => m.UserListComponent),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: '**', redirectTo: '/main' },
];
