import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

import { TranslatePipe } from '../../translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly error = signal('');

  readonly loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  login(): void {
    const { username, password } = this.loginForm.getRawValue();
    this.authService.login({ username, password }).subscribe({
      next: (response) => {
        console.log('Login successful, response:', response);
        if (response.passwordResetRequired) {
          console.log('Forcing password change to /change-password...');
          this.router.navigateByUrl('/change-password').catch(err => console.error('Navigation error:', err));
        } else {
          this.router.navigate(['/main']).catch(err => console.error('Navigation error:', err));
        }
      },
      error: () => this.error.set('Invalid username or password'),
    });
  }
}
