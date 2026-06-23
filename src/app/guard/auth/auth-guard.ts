import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);

  const { value } = await Preferences.get({ key: 'signup' });

  if (!value) {
    return router.createUrlTree(['/login']);
  }

  try {
    const data = JSON.parse(value);
    return data?.isLogin ? true : router.createUrlTree(['/login']);
  } catch {
    return router.createUrlTree(['/login']);
  }
};