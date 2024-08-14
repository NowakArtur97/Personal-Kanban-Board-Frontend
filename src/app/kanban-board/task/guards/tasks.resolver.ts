import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { TaskService } from '../services/task.service';
import { UserService } from '../../user/services/user.service';
import Task from '../models/task.model';

export const tasksResolver: ResolveFn<Task[]>
    = (): any => {
        const { token } = inject(UserService).user();
        inject(TaskService).getUserTasks(token);
    };