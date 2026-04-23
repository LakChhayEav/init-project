import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'main', loadComponent: () => import('./components/main-page/main-page.component').then(m => m.MainPageComponent), canActivate: [authGuard] },
  { path: 'tasks', loadComponent: () => import('./components/task-list/task-list.component').then(m => m.TaskListComponent), canActivate: [authGuard] },
  { path: 'users', loadComponent: () => import('./components/user-list/user-list.component').then(m => m.UserListComponent), canActivate: [authGuard] },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: '**', redirectTo: '/main' }
];
