import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../translate.pipe';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-[500px] flex items-center justify-center bg-slate-50/50 p-4 md:p-8 rounded-2xl">
      <div class="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-500">
        <div class="p-8 md:p-12">
          <div class="text-center mb-10">
            <div class="w-20 h-20 bg-gradient-to-tr from-amber-600 to-amber-400 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-200 ring-8 ring-amber-50">
              <i class="bi bi-shield-lock text-3xl"></i>
            </div>
            <h1 class="text-3xl font-black text-slate-900 tracking-tight mb-2">{{ 'auth.change_password_title' | translate }}</h1>
            <p class="text-slate-500 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
              For security reasons, you must change your password before continuing.
            </p>
          </div>

          <form [formGroup]="changeForm" (ngSubmit)="submit()" class="space-y-6">
            <div class="space-y-2">
              <label for="newPassword" class="label-pro text-slate-700 font-bold ml-1">{{ 'user.new_password' | translate }}</label>
              <input id="newPassword" formControlName="newPassword" type="password" class="input-pro h-14 text-lg focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50/50" [placeholder]="'user.new_password' | translate" />
            </div>

            <div class="space-y-2">
              <label for="confirmPassword" class="label-pro text-slate-700 font-bold ml-1">{{ 'user.confirm_password' | translate }}</label>
              <input id="confirmPassword" formControlName="confirmPassword" type="password" class="input-pro h-14 text-lg focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50/50" [placeholder]="'user.confirm_password' | translate" />
              @if (changeForm.errors?.['mismatch'] && changeForm.get('confirmPassword')?.touched) {
                <p class="text-xs text-red-500 font-bold mt-2 uppercase tracking-tight flex items-center gap-2 px-1">
                  <i class="bi bi-exclamation-triangle-fill"></i>
                  Passwords do not match
                </p>
              }
            </div>

            <button type="submit" class="btn-primary w-full h-14 mt-6 text-lg font-black tracking-wider bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 border-none shadow-xl shadow-amber-200/50 rounded-2xl transition-all active:scale-[0.98]" [disabled]="loading() || changeForm.invalid">
              @if (loading()) {
                <span class="inline-block w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3"></span>
              }
              {{ 'auth.update_password' | translate }}
            </button>

            @if (error()) {
              <div class="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in slide-in-from-top-2">
                <i class="bi bi-exclamation-circle-fill text-lg"></i>
                {{ error() }}
              </div>
            }
          </form>
        </div>
      </div>
    </div>
  `
})
export class ChangePasswordComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loading = signal(false);
  error = signal('');

  changeForm = this.fb.nonNullable.group({
    newPassword: ['', [Validators.required, Validators.minLength(4)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(group: any) {
    const pass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass && confirm && pass === confirm ? null : { mismatch: true };
  }

  submit() {
    console.log('Submit clicked. Form valid:', this.changeForm.valid);
    if (this.changeForm.invalid) {
      console.log('Form errors:', this.changeForm.errors);
      return;
    }
    
    this.loading.set(true);
    this.error.set('');
    
    const newPassword = this.changeForm.getRawValue().newPassword;
    console.log('Changing password for user...');

    this.authService.changePassword(newPassword).subscribe({
      next: () => {
        console.log('Password changed successfully. Redirecting...');
        this.loading.set(false);
        this.router.navigate(['/main']);
      },
      error: (err) => {
        console.error('Password change failed:', err);
        this.error.set('Failed to update password. Please try again.');
        this.loading.set(false);
      }
    });
  }
}
