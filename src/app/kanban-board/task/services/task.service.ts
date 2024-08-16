import { Injectable, inject, signal } from '@angular/core';
import Task from '../models/task.model';
import { Apollo } from 'apollo-angular';
import { CREATE_TASK, FIND_ALL_USER_TASKS } from './task.queries';
import { HttpHeaders } from '@angular/common/http';
import TaskDTO from '../models/task.dto';
import { ApolloError } from '@apollo/client';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private readonly ERROR_MESSAGE_DIVIDER = "\n";

    private apollo = inject(Apollo);

    #tasks = signal<Task[]>([]);
    #errors = signal<string[]>([]);

    tasks = this.#tasks.asReadonly();
    errors = this.#errors.asReadonly();

    createTask(taskDTO: TaskDTO): void {
        this.apollo.mutate({
            mutation: CREATE_TASK,
            variables: {
                taskDTO,
            },
        }).subscribe(({ data }: any) =>
            this.#tasks.set([...this.tasks(), data.createTask]),
            (error: ApolloError) =>
                this.#errors.set(error.message.split(this.ERROR_MESSAGE_DIVIDER))
        );
    }

    getUserTasks(token: string): void {
        this.apollo.watchQuery({
            query: FIND_ALL_USER_TASKS,
            context: {
                headers: new HttpHeaders().set("Authorization", "Bearer " + token),
            }
        }).valueChanges.subscribe(({ data, error }: any) =>
            this.#tasks.set(data.tasks)
        );
    }
}