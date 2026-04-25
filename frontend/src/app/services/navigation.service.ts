import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from './language.service';
import { PermissionService } from './permission.service';
import { AuthService } from './auth.service';

export type MenuTabType = 'main' | 'tasks' | 'users' | 'permissions' | 'change-password';

export interface AppTab {
  id: string;
  type: MenuTabType;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly router = inject(Router);
  private readonly langService = inject(LanguageService);
  private readonly permissionService = inject(PermissionService);
  private readonly authService = inject(AuthService);

  readonly tabs = signal<AppTab[]>([]);
  readonly activeTabId = signal<string | null>(null);
  readonly isSidebarOpen = signal(true);

  readonly activeTab = computed(
    () => this.tabs().find((tab) => tab.id === this.activeTabId()) ?? null,
  );

  constructor() {
    // Initial accessible tab
    if (this.authService.isLoggedIn()) {
      const first = this.getFirstAccessibleTab();
      if (first) this.openMenuTab(first);
    }
  }

  openMenuTab(type: MenuTabType): void {
    if (!this.permissionService.canView(type)) return;

    const existing = this.tabs().find((tab) => tab.type === type);
    if (existing) {
      this.activeTabId.set(existing.id);
    } else {
      const newTab: AppTab = {
        id: `${type}-${Date.now()}`,
        type,
        title: this.langService.translate(`nav.${type}`),
      };
      this.tabs.update((tabs) => [...tabs, newTab]);
      this.activeTabId.set(newTab.id);
    }
    this.router.navigate([`/${type}`]);
  }

  activateTab(tabId: string): void {
    const target = this.tabs().find((tab) => tab.id === tabId);
    if (!target) return;

    this.activeTabId.set(tabId);
    this.router.navigate([`/${target.type}`]);
  }

  closeTab(tabId: string, event?: Event): void {
    event?.stopPropagation();
    const currentTabs = this.tabs();
    const index = currentTabs.findIndex((tab) => tab.id === tabId);
    if (index === -1) return;

    const wasActive = this.activeTabId() === tabId;
    const remaining = currentTabs.filter((tab) => tab.id !== tabId);
    this.tabs.set(remaining);

    if (remaining.length === 0) {
      this.activeTabId.set(null);
      this.openMenuTab('main');
      return;
    }

    if (wasActive) {
      const fallback = remaining[Math.max(0, index - 1)];
      this.activeTabId.set(fallback.id);
      this.router.navigate([`/${fallback.type}`]);
    }
  }

  closeOtherTabs(tabId: string): void {
    const currentTabs = this.tabs();
    const target = currentTabs.find((t) => t.id === tabId);
    if (!target) return;

    this.tabs.set([target]);
    this.activeTabId.set(tabId);
    this.router.navigate([`/${target.type}`]);
  }

  closeAllTabs(): void {
    this.tabs.set([]);
    this.activeTabId.set(null);
    this.openMenuTab('main');
  }

  closeTabsToRight(tabId: string): void {
    const currentTabs = this.tabs();
    const index = currentTabs.findIndex((t) => t.id === tabId);
    if (index === -1) return;

    const remaining = currentTabs.slice(0, index + 1);
    this.tabs.set(remaining);
    
    if (!remaining.some(t => t.id === this.activeTabId())) {
      this.activeTabId.set(tabId);
      this.router.navigate([`/${remaining[index].type}`]);
    }
  }

  isTabTypeActive(type: MenuTabType): boolean {
    return this.activeTab()?.type === type;
  }

  updateTabTitles(): void {
    this.tabs.update((tabs) =>
      tabs.map((tab) => ({
        ...tab,
        title: this.langService.translate(`nav.${tab.type}`),
      })),
    );
  }

  clearTabs(): void {
    this.tabs.set([]);
    this.activeTabId.set(null);
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(v => !v);
  }

  private getFirstAccessibleTab(): MenuTabType | null {
    const order: MenuTabType[] = ['main', 'tasks', 'users', 'permissions'];
    return order.find((t) => this.permissionService.canView(t)) ?? null;
  }
}
