import { CanActivateFn } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const adminOnly = route.data?.['adminOnly'] === true;

  // On SSR/prerender there is no localStorage; defer auth enforcement to browser.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  if (adminOnly && !auth.isAdmin()) {
    return router.createUrlTree(['/hotels']);
  }

  return true;
};
