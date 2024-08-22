import { Injectable, inject, signal } from '@angular/core';
import Task from '../models/task.model';
import { Apollo } from 'apollo-angular';
import { CREATE_TASK, FIND_ALL_USER_TASKS } from './task.queries';
import TaskDTO from '../models/task.dto';
import { ApolloError } from '@apollo/client';
import { UserService } from '../../user/services/user.service';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private readonly ERROR_MESSAGE_DIVIDER = "\n";

    private apollo = inject(Apollo);
    private userService = inject(UserService);

    #tasks = signal<Task[]>([]);
    #taskToUpdate = signal<TaskDTO | null>({
        title: "",
        description: "",
        status: "READY_TO_START",
        priority: "LOW",
        targetEndDate: new Date().toISOString().substring(0, 10),
        assignedTo: this.userService.user().userId
    });
    #errors = signal<string[]>([]);
    #isTaskFormVisible = signal<boolean>(false);

    tasks = this.#tasks.asReadonly();
    errors = this.#errors.asReadonly();
    isTaskFormVisible = this.#isTaskFormVisible.asReadonly();
    taskToUpdate = this.#taskToUpdate.asReadonly();

    createTask(taskDTO: TaskDTO): void {
        this.apollo.mutate({
            mutation: CREATE_TASK,
            variables: {
                taskDTO,
            },
            context: {
                headers: this.userService.getAuthorizationHeader(),
            }
        }).subscribe(({ data }: any) =>
            this.#tasks.set([...this.tasks(), data.createTask]),
            (error: ApolloError) =>
                this.#errors.set(error.message.split(this.ERROR_MESSAGE_DIVIDER))
        );
    }
    getUserTasks(): void {
        this.apollo.watchQuery({
            query: FIND_ALL_USER_TASKS,
            context: {
                headers: this.userService.getAuthorizationHeader(),
            }
        }).valueChanges.subscribe(({ data, error }: any) =>
            this.#tasks.set(data.tasks)
        );
    }

    setTaskToUpdate(task: Task | null): void {
        if (task === null) {
            this.#taskToUpdate.set(null);
        } else {
            console.log(task.status + "");
            this.#taskToUpdate.set({
                title: task.title,
                description: task.description,
                status: task.status + "",
                priority: task.priority + "",
                targetEndDate: task.targetEndDate,
                assignedTo: task.assignedTo
            });
        }
    }

    changeTaskFormVisibility(isVisible: boolean): void {
        this.#isTaskFormVisible.set(isVisible);
    }
}