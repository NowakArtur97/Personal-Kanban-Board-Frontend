import { Injectable, inject, signal } from '@angular/core';
import Task from '../models/task.model';
import { Apollo } from 'apollo-angular';
import {
  CREATE_TASK,
  DELETE_ALL_TASKS,
  DELETE_TASK,
  FIND_ALL_TASKS,
  UPDATE_TASK,
  UPDATE_USER_ASSIGNED_TO_TASK,
} from './task.queries';
import TaskDTO from '../models/task.dto';
import { ApolloError } from '@apollo/client';
import { UserService } from '../../user/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly ERROR_MESSAGE_DIVIDER = '\n';

  private apollo = inject(Apollo);
  private userService = inject(UserService);

  #tasks = signal<Task[]>([]);
  #taskIdToUpdate = signal<String | null>(null);
  #taskToUpdate = signal<TaskDTO | null>({
    title: '',
    description: '',
    status: 'READY_TO_START',
    priority: 'LOW',
    targetEndDate: new Date().toISOString().substring(0, 10),
    assignedTo: this.userService.user().userId,
  });
  #errors = signal<string[]>([]);
  #isTaskFormVisible = signal<boolean>(false);
  #shouldDeleteAllTasks = signal<boolean>(false);

  tasks = this.#tasks.asReadonly();
  errors = this.#errors.asReadonly();
  isTaskFormVisible = this.#isTaskFormVisible.asReadonly();
  taskIdToUpdate = this.#taskIdToUpdate.asReadonly();
  taskToUpdate = this.#taskToUpdate.asReadonly();
  shouldDeleteAllTasks = this.#shouldDeleteAllTasks.asReadonly();

  createTask(taskDTO: TaskDTO): void {
    this.apollo
      .mutate({
        mutation: CREATE_TASK,
        variables: {
          taskDTO,
        },
        context: {
          headers: this.userService.createAuthorizationHeader(),
        },
      })
      .subscribe(
        ({ data }: any) => {
          this.#tasks.set([...this.tasks(), data.createTask]);
          this.changeTaskFormVisibility(false);
        },
        (error: ApolloError) =>
          this.#errors.set(error.message.split(this.ERROR_MESSAGE_DIVIDER))
      );
  }

  updateTask(taskDTO: TaskDTO): void {
    this.apollo
      .mutate({
        mutation: UPDATE_TASK,
        variables: {
          taskId: this.taskIdToUpdate(),
          taskDTO,
        },
        context: {
          headers: this.userService.createAuthorizationHeader(),
        },
      })
      .subscribe(
        ({ data }: any) => {
          this.#tasks.set([
            ...this.tasks().filter(
              (task) => task.taskId !== data.updateTask.taskId
            ),
            data.updateTask,
          ]);
          this.changeTaskFormVisibility(false);
        },
        (error: ApolloError) =>
          this.#errors.set(error.message.split(this.ERROR_MESSAGE_DIVIDER))
      );
  }

  updateAssignedUserToTask(taskId: string, assignedToId: string): void {
    this.apollo
      .mutate({
        mutation: UPDATE_USER_ASSIGNED_TO_TASK,
        variables: {
          taskId,
          assignedToId,
        },
        context: {
          headers: this.userService.createAuthorizationHeader(),
        },
      })
      .subscribe(
        ({ data }: any) => {
          this.#tasks.set([
            ...this.tasks().filter(
              (task) => task.taskId !== data.updateUserAssignedToTask.taskId
            ),
            data.updateUserAssignedToTask,
          ]);
        },
        (error: ApolloError) =>
          this.#errors.set(error.message.split(this.ERROR_MESSAGE_DIVIDER))
      );
  }

  deleteTask(taskId: String): void {
    this.apollo
      .mutate({
        mutation: DELETE_TASK,
        variables: {
          taskId,
        },
        context: {
          headers: this.userService.createAuthorizationHeader(),
        },
      })
      .subscribe(
        () => {
          // TODO: Remove or try to fix
          // this.#tasks.set([...this.tasks().filter(task => task.taskId !== taskId)]);
        },
        (error: ApolloError) =>
          this.#errors.set(error.message.split(this.ERROR_MESSAGE_DIVIDER))
      );
  }

  deleteAllTasks(): void {
    this.#shouldDeleteAllTasks.set(true);
    this.apollo
      .mutate({
        mutation: DELETE_ALL_TASKS,
        context: {
          headers: this.userService.createAuthorizationHeader(),
        },
      })
      .subscribe(() => this.#shouldDeleteAllTasks.set(false));
    // TODO: Display errors?
  }

  findAllTasks(): void {
    this.apollo
      .watchQuery({
        query: FIND_ALL_TASKS,
        context: {
          headers: this.userService.createAuthorizationHeader(),
        },
      })
      .valueChanges.subscribe(({ data, error }: any) =>
        this.#tasks.set(data.tasks)
      );
  }

  setTaskToUpdate(task: Task | null): void {
    if (task === null) {
      this.#taskIdToUpdate.set(null);
      this.#taskToUpdate.set(null);
    } else {
      this.#taskIdToUpdate.set(task.taskId);
      this.#taskToUpdate.set({
        title: task.title,
        description: task.description,
        status: task.status + '',
        priority: task.priority + '',
        targetEndDate: task.targetEndDate,
        assignedTo: this.userService
          .users()
          .find((user) => user.username === task.assignedTo)!!.userId,
      });
    }
  }

  changeTaskFormVisibility(isVisible: boolean): void {
    this.#isTaskFormVisible.set(isVisible);
  }
}
