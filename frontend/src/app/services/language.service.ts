import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Language = 'en' | 'km';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  
  readonly currentLang = signal<Language>(this.getInitialLang());

  private readonly translations: Record<Language, Record<string, string>> = {
    en: {
      'app.title': 'TaskFlow Pro',
      'nav.main': 'Main',
      'nav.tasks': 'Tasks',
      'nav.users': 'Users',
      'nav.permissions': 'Permissions',
      'auth.logout': 'Logout',
      'auth.signin': 'Sign in',
      'auth.signup': 'Sign up',
      'common.search': 'Search',
      'common.status': 'Status',
      'common.role': 'Role',
      'common.actions': 'Actions',
      'common.reset': 'Reset',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
      'common.add': 'Add',
      'user.list.title': 'User Management',
      'user.list.subtitle': 'Manage your team and their access levels.',
      'user.add': 'Add User',
      'user.edit': 'Edit User',
      'user.username': 'Username',
      'user.email': 'Email',
      'user.password': 'Password',
      'user.enabled': 'Enabled',
      'user.active': 'Active',
      'user.inactive': 'Inactive',
      'user.roles': 'Roles',
      'task.create': 'Create Task',
      'task.title': 'Task Title',
      'task.description': 'Description',
      'task.submit': 'Submit Form',
      'dashboard.welcome': 'Welcome back',
      'dashboard.total_users': 'Total Users',
      'dashboard.active_users': 'Active Users',
      'dashboard.pending_users': 'Pending Users',
      'dashboard.open_tasks': 'Open Tasks',
      'dashboard.recent_users': 'Recent Users',
      'dashboard.view_all': 'View all',
      'common.showing': 'Showing',
      'common.of': 'of',
      'common.users': 'users',
      'common.rows_per_page': 'Rows per page:',
      'task.new': 'Create New Task',
      'common.no_tasks': 'No tasks found. Create one to get started.',
      'common.completed': 'Completed',
      'common.pending': 'Pending'
    },
    km: {
      'app.title': 'ប្រព័ន្ធគ្រប់គ្រងការងារ',
      'nav.main': 'ទំព័រដើម',
      'nav.tasks': 'ការងារ',
      'nav.users': 'អ្នកប្រើប្រាស់',
      'nav.permissions': 'សិទ្ធិប្រើប្រាស់',
      'auth.logout': 'ចាកចេញ',
      'auth.signin': 'ចូលប្រើ',
      'auth.signup': 'ចុះឈ្មោះ',
      'common.search': 'ស្វែងរក',
      'common.status': 'ស្ថានភាព',
      'common.role': 'តួនាទី',
      'common.actions': 'សកម្មភាព',
      'common.reset': 'កំណត់ឡើងវិញ',
      'common.cancel': 'បោះបង់',
      'common.save': 'រក្សាទុក',
      'common.edit': 'កែសម្រួល',
      'common.delete': 'លុប',
      'common.add': 'បន្ថែម',
      'user.list.title': 'ការគ្រប់គ្រងអ្នកប្រើប្រាស់',
      'user.list.subtitle': 'គ្រប់គ្រងក្រុមការងារ និងកម្រិតសិទ្ធិចូលប្រើប្រាស់របស់អ្នក។',
      'user.add': 'បន្ថែមអ្នកប្រើប្រាស់',
      'user.edit': 'កែសម្រួលអ្នកប្រើប្រាស់',
      'user.username': 'ឈ្មោះអ្នកប្រើ',
      'user.email': 'អ៊ីមែល',
      'user.password': 'លេខសម្ងាត់',
      'user.enabled': 'បើកដំណើរការ',
      'user.active': 'កំពុងដំណើរការ',
      'user.inactive': 'ផ្អាកដំណើរការ',
      'user.roles': 'តួនាទី',
      'task.create': 'បង្កើតកិច្ចការ',
      'task.title': 'ចំណងជើងកិច្ចការ',
      'task.description': 'ការពិពណ៌នា',
      'task.submit': 'បញ្ជូនទិន្នន័យ',
      'dashboard.welcome': 'សូមស្វាគមន៍មកវិញ',
      'dashboard.total_users': 'អ្នកប្រើប្រាស់សរុប',
      'dashboard.active_users': 'អ្នកប្រើប្រាស់សកម្ម',
      'dashboard.pending_users': 'អ្នកប្រើប្រាស់រង់ចាំ',
      'dashboard.open_tasks': 'កិច្ចការបើកចំហ',
      'dashboard.recent_users': 'អ្នកប្រើប្រាស់ថ្មីៗ',
      'dashboard.view_all': 'មើលទាំងអស់',
      'common.showing': 'បង្ហាញ',
      'common.of': 'នៃ',
      'common.users': 'អ្នកប្រើប្រាស់',
      'common.rows_per_page': 'ចំនួនជួរដេកក្នុងមួយទំព័រ:',
      'task.new': 'បង្កើតកិច្ចការថ្មី',
      'common.no_tasks': 'រកមិនឃើញកិច្ចការទេ។ បង្កើតមួយដើម្បីចាប់ផ្តើម។',
      'common.completed': 'បានបញ្ចប់',
      'common.pending': 'កំពុងរង់ចាំ'
    }
  };

  translate(key: string): string {
    return this.translations[this.currentLang()][key] || key;
  }

  setLanguage(lang: Language): void {
    this.currentLang.set(lang);
    if (this.isBrowser) {
      localStorage.setItem('lang', lang);
      document.documentElement.lang = lang;
    }
  }

  private getInitialLang(): Language {
    if (this.isBrowser) {
      const saved = localStorage.getItem('lang') as Language;
      if (saved === 'en' || saved === 'km') return saved;
    }
    return 'en';
  }
}
