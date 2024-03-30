import { Injectable, signal } from '@angular/core';
import Task from '../models/task.model';
import TEMP_TASKS from './tasks.data';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    #tasks = signal<Task[]>(TEMP_TASKS);

    tasks = this.#tasks.asReadonly();
}