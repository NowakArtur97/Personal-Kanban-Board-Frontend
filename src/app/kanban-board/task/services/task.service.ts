import { Injectable, signal } from '@angular/core';
import Task from '../models/task.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    #tasks = signal<Task[]>([]);

    tasks = this.#tasks.asReadonly();
}