import { ActivatedRouteSnapshot, RouterStateSnapshot, ResolveFn } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { UserService } from '../../user/services/user.service';
import { TaskService } from '../services/task.service';

export const tasksResolver: ResolveFn<any>
    = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> => {
        const taskService = inject(TaskService);
        const userService = inject(UserService);

        switch (state.url) {
            case "/":
                taskService.getTasksByUsername(userService.user().username);
        }
        return EMPTY;
    };