import { Component, ChangeDetectionStrategy, inject, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LanguageService, Language } from './services/language.service';
import { NavigationService } from './services/navigation.service';
import { PermissionService } from './services/permission.service';

// Layout Components
import { HeaderComponent } from './components/layout/header/header.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { FooterComponent } from './components/layout/footer/footer.component';

// Page Components
import { MainPageComponent } from './components/main-page/main-page.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { RolePermissionComponent } from './components/role-permission/role-permission.component';
import { ConfirmDialogComponent } from './components/shared/confirm-dialog/confirm-dialog.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { TranslatePipe } from './translate.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    MainPageComponent,
    TaskListComponent,
    UserListComponent,
    RolePermissionComponent,
    ConfirmDialogComponent,
    ChangePasswordComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly authService = inject(AuthService);
  readonly langService = inject(LanguageService);
  readonly navService = inject(NavigationService);
  readonly permissionService = inject(PermissionService);

  constructor() {
    effect(() => {
      const loggedIn = this.authService.isLoggedIn();
      const currentTabs = this.navService.tabs();

      if (!loggedIn && currentTabs.length > 0) {
        this.navService.clearTabs();
        return;
      }

      if (loggedIn && currentTabs.length === 0) {
        const order = ['main', 'tasks', 'users', 'permissions'] as any[];
        const first = order.find((t) => this.permissionService.canView(t));
        if (first) this.navService.openMenuTab(first);
        return;
      }

      // Remove tabs the user can no longer view
      const filtered = currentTabs.filter((tab) => this.permissionService.canView(tab.type));
      if (filtered.length !== currentTabs.length) {
        this.navService.tabs.set(filtered);
        if (
          this.navService.activeTabId() &&
          !filtered.some((t) => t.id === this.navService.activeTabId())
        ) {
          this.navService.activeTabId.set(filtered[0]?.id ?? null);
        }
      }
    });

    // Handle language changes for tab titles
    effect(() => {
      this.langService.currentLang(); // trigger on change
      this.navService.updateTabTitles();
    });
  }
}
