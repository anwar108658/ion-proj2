import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

export const guestGuard: CanActivateFn = async () => {
  const router = inject(Router);

  const { value } = await Preferences.get({ key: 'signup' });

  if (value) {
    try {
      const data = JSON.parse(value);
      if (data?.isLogin) {
        return router.createUrlTree(['/home']);
      }
    } catch {}
  }

  return true;
};