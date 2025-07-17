import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import User from '../models/user.model';

export const usersResolver: ResolveFn<User[]> = (): any => {
  inject(UserService).findAllUsers();
};
