import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    if (authService.isLoggedIn()) {
      const isChangePasswordPage = state.url === '/change-password';
      const resetRequired = authService.passwordResetRequired();

      console.log('Guard Check:', { url: state.url, resetRequired, isChangePasswordPage });

      if (resetRequired && !isChangePasswordPage) {
        console.log('Guard: Redirecting to /change-password');
        router.navigateByUrl('/change-password');
        return false;
      }
      return true;
    }
    console.log('Guard: User not logged in, redirecting to login');
    router.navigate(['/login']);
    return false;
  }

  // Default to allowing during SSR to prevent redirects on server
  return true;
};
