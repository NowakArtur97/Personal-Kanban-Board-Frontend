import { Injectable, inject, signal } from '@angular/core';
import Task from '../models/task.model';
import { Apollo } from 'apollo-angular';
import { GET_TASKS } from './task.queries';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private apollo = inject(Apollo);

    #tasks = signal<Task[]>([]);
    tasks = this.#tasks.asReadonly();

    getUserTasks(token: string): void {
        this.apollo.watchQuery({
            query: GET_TASKS,
            context: {
                headers: new HttpHeaders().set("Authorization", "Bearer " + token),
            }
        }).valueChanges.subscribe(({ data, error }: any) =>
            this.#tasks.set(data.tasks)
        );
    }
}