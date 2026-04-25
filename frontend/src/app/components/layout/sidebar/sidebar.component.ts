import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LanguageService } from '../../../services/language.service';
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
  readonly langService = inject(LanguageService);
  private readonly router = inject(Router);

  readonly isSecurityMenuOpen = signal(false);
  readonly searchQuery = signal('');

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    
    // If searching, keep security menu open to show results
    if (value.trim()) {
      this.isSecurityMenuOpen.set(true);
    }
  }

  shouldShow(type: string, labelKey: string): boolean {
    if (!this.permissionService.canView(type as any)) return false;
    
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return true;
    
    // Check key, type, and translations in both languages
    const matchesKey = labelKey.toLowerCase().includes(query) || type.toLowerCase().includes(query);
    if (matchesKey) return true;

    // Check actual translated text in all languages
    const enText = (this.langService as any).translations?.['en']?.[labelKey]?.toLowerCase() || '';
    const kmText = (this.langService as any).translations?.['km']?.[labelKey]?.toLowerCase() || '';
    
    return enText.includes(query) || kmText.includes(query);
  }

  toggleSecurityMenu(): void {
    if (!this.navService.isSidebarOpen()) {
      this.navService.toggleSidebar();
      this.isSecurityMenuOpen.set(true);
    } else {
      this.isSecurityMenuOpen.update((v) => !v);
    }
  }

  logout(): void {
    this.authService.logout();
    this.navService.clearTabs();
    this.router.navigate(['/login']);
  }
}
