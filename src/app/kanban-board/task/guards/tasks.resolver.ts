import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { TaskService } from '../services/task.service';
import Task from '../models/task.model';

export const tasksResolver: ResolveFn<Task[]>
    = (): any => {
        inject(TaskService).getUserTasks();
    };