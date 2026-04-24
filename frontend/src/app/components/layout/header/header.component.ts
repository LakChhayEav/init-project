import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { LanguageService, Language } from '../../../services/language.service';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly authService = inject(AuthService);
  readonly langService = inject(LanguageService);
  readonly navService = inject(NavigationService);

  changeLang(lang: Language): void {
    this.langService.setLanguage(lang);
    // Note: The parent component should handle updating tab titles if needed,
    // but LanguageService is shared, so we can also use an event/signal if needed.
    // For now, let's assume the parent app component handles it via a global lang change listener or signal effect.
  }
}
