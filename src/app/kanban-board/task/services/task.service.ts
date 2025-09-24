import { Injectable, inject, signal } from '@angular/core';
import Task from '../models/task.model';
import { Apollo } from 'apollo-angular';
import {
  CREATE_TASK,
  DELETE_ALL_TASKS,
  DELETE_TASK,
  FIND_ALL_TASKS,
  FIND_ALL_TASKS_ASSIGNED_TO,
  UPDATE_TASK,
  UPDATE_USER_ASSIGNED_TO_TASK,
} from './task.queries';
import TaskDTO from '../models/task.dto';
import { ApolloError } from '@apollo/client';
import { UserService } from '../../user/services/user.service';
import Subtask from '../models/subtask.model';
import { CREATE_SUBTASK, DELETE_SUBTASK } from './subtask.queries';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly ERROR_MESSAGE_DIVIDER = '\n';

  private apollo = inject(Apollo);
  private userService = inject(UserService);

  #tasks = signal<Task[]>([]);
  #taskIdToUpdate: string | null = null;
  #taskToUpdate = signal<TaskDTO | null>({
    title: '',
    description: '',
    status: 'READY_TO_START',
    priority: 'LOW',
    targetEndDate: new Date().toISOString().substring(0, 10),
    assignedTo: this.userService.user().userId,
  });
  #taskIdToAddSubtask = signal<string | null>(null);
  #taskWithUpdatedStatus = signal<Task | null>(null);
  #deletedTaskId = signal<string | null>(null);
  #errors = signal<string[]>([]);
  #isTaskFormVisible = signal<boolean>(false);
  #shouldDeleteAllTasks = signal<boolean>(false);

  tasks = this.#tasks.asReadonly();
  taskToUpdate = this.#taskToUpdate.asReadonly();
  taskIdToAddSubtask = this.#taskIdToAddSubtask.asReadonly();
  taskWithUpdatedStatus = this.#taskWithUpdatedStatus.asReadonly();
  deletedTaskId = this.#deletedTaskId.asReadonly();
  errors = this.#errors.asReadonly();
  isTaskFormVisible = this.#isTaskFormVisible.asReadonly();
  shouldDeleteAllTasks = this.#shouldDeleteAllTasks.asReadonly();

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

  // TODO: Refactor with method findAllTasks
  findAllTasksAssignedToUser(assignedToId: string): void {
    this.apollo
      .watchQuery({
        query: FIND_ALL_TASKS_ASSIGNED_TO,
        variables: {
          assignedToId,
        },
        context: {
          headers: this.userService.createAuthorizationHeader(),
        },
      })
      .valueChanges.subscribe(({ data, error }: any) =>
        this.#tasks.set(data.tasksAssignedTo)
      );
  }

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
          taskId: this.#taskIdToUpdate,
          taskDTO,
        },
        context: {
          headers: this.userService.createAuthorizationHeader(),
        },
      })
      .subscribe(
        ({ data }: any) => {
          const updatedTask = data.updateTask;
          const taskBeforeUpdate = this.#taskToUpdate();
          if (taskDTO.status !== taskBeforeUpdate!!.status) {
            this.#taskWithUpdatedStatus.set(updatedTask);
          }
          this.#tasks.set([
            ...this.tasks().filter(
              (task) => task.taskId !== updatedTask.taskId
            ),
            updatedTask,
          ]);
          this.changeTaskFormVisibility(false);
          this.setTaskToUpdate(null);
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

  addTaskToSubtask(subtask: Subtask) {
    const taskWithNewSubtask = this.tasks().filter(
      (task) => task.taskId === this.taskIdToAddSubtask()
    )[0];
    taskWithNewSubtask.subtasks.push(...taskWithNewSubtask.subtasks, subtask);
    this.#tasks.set([
      ...this.tasks().filter(
        (task) => task.taskId !== this.taskIdToAddSubtask()
      ),
      taskWithNewSubtask,
    ]);
    this.changeTaskFormVisibility(false);
    this.setTaskIdToAddSubtask(null);
  }

  deleteTask(taskId: string): void {
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
        // TODO: Remove or create popup message with errors instead of displaying on task form
        (error: ApolloError) =>
          this.#errors.set(error.message.split(this.ERROR_MESSAGE_DIVIDER))
      );
  }

  deleteSubtaskFromTask(taskId: string, subtaskId: string): void {
    const task = { ...this.tasks().find((task) => task.taskId === taskId)!! };
    task.subtasks = task.subtasks.filter(
      (subtask) => subtask.subtaskId !== subtaskId
    );
    this.#tasks.set([
      ...this.tasks().filter((task) => task.taskId !== taskId),
      task,
    ]);
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

  createSubtask(subtaskDTO: TaskDTO): void {
    this.apollo
      .mutate({
        mutation: CREATE_SUBTASK,
        variables: {
          taskId: this.taskIdToAddSubtask(),
          subtaskDTO,
        },
        context: {
          headers: this.userService.createAuthorizationHeader(),
        },
      })
      .subscribe(
        ({ data }: any) => this.addTaskToSubtask(data.createSubtask),
        (error: ApolloError) =>
          this.#errors.set(error.message.split(this.ERROR_MESSAGE_DIVIDER))
      );
  }

  deleteSubtask(subtaskId: string): void {
    this.apollo
      .mutate({
        mutation: DELETE_SUBTASK,
        variables: {
          subtaskId,
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
        // TODO: Remove or create popup message with errors instead of displaying on task form
        (error: ApolloError) => {}
      );
  }

  setTaskToUpdate(task: Task | null): void {
    this.#taskIdToAddSubtask.set(null);
    if (task === null) {
      this.#taskIdToUpdate = null;
      this.#taskToUpdate.set(null);
    } else {
      this.#taskIdToUpdate = task.taskId;
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

  setTaskIdToAddSubtask(id: string | null): void {
    this.#taskIdToUpdate = null;
    this.#taskToUpdate.set(null);
    this.#taskIdToAddSubtask.set(id);
  }

  setDeletedTaskId(taskId: string): void {
    this.#deletedTaskId.set(taskId);
  }

  changeTaskFormVisibility(isTaskFormVisible: boolean): void {
    this.#isTaskFormVisible.set(isTaskFormVisible);
  }
}
