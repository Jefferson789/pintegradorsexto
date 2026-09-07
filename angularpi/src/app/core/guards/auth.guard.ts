import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);

  const router = inject(Router);

  const sessionValid =
    await authService
      .validateSession();

  if (!sessionValid) {
    return router.createUrlTree([
      '/'
    ]);
  }

  return true;
};