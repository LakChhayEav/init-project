import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../../../services/confirm.service';
import { TranslatePipe } from '../../../translate.pipe';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    @if (confirmService.config(); as config) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
          <div class="p-6 text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="bi bi-exclamation-triangle text-3xl text-red-600"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">{{ config.title | translate }}</h3>
            <p class="text-slate-500 mb-6">{{ config.message | translate }}</p>
            <div class="flex gap-3">
              <button class="btn-secondary flex-1" (click)="confirmService.cancel()">
                {{ config.cancelText! | translate }}
              </button>
              <button class="btn-primary bg-red-600 hover:bg-red-700 ring-red-500 border-red-600 flex-1" (click)="confirmService.confirm()">
                {{ config.confirmText! | translate }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  readonly confirmService = inject(ConfirmService);
}
