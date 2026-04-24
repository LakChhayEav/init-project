import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NavigationService, MenuTabType } from '../../../services/navigation.service';
import { PermissionService } from '../../../services/permission.service';
import { TranslatePipe } from '../../../translate.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  readonly authService = inject(AuthService);
  readonly navService = inject(NavigationService);
  readonly permissionService = inject(PermissionService);
  private readonly router = inject(Router);

  readonly isSecurityMenuOpen = signal(false);

  toggleSecurityMenu(): void {
    this.isSecurityMenuOpen.update((v) => !v);
  }

  logout(): void {
    this.authService.logout();
    this.navService.clearTabs();
    this.router.navigate(['/login']);
  }
}
