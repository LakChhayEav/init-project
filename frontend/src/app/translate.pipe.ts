import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from './services/language.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false, // Necessary because currentLang is a signal and we want to react to its changes
})
export class TranslatePipe implements PipeTransform {
  private readonly langService = inject(LanguageService);

  transform(key: string): string {
    return this.langService.translate(key);
  }
}
