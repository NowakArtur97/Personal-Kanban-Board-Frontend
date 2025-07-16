import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { PATHS } from '../../../app.routes';

export const isAuthenticated: CanActivateFn = () => {
  const isAuthenticated = inject(UserService).user()?.token.length > 0;
  if (!isAuthenticated) {
    inject(Router).navigate([PATHS.DEFAULT]);
  }
  return isAuthenticated;
};
