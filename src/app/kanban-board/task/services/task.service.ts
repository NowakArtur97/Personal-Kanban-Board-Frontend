import { Injectable, inject, signal } from '@angular/core';
import Task from '../models/task.model';
import { Apollo } from 'apollo-angular';
import {
  CREATE_TASK,
  DELETE_ALL_TASKS,
  DELETE_TASK,
  FIND_ALL_TASKS,
  FIND_ALL_TASKS_ASSIGNED_TO,
  TASK_EVENT,
  UPDATE_TASK,
  UPDATE_USER_ASSIGNED_TO_TASK,
} from './task.queries';
import TaskDTO from '../models/task.dto';
import { ApolloError, DocumentNode } from '@apollo/client';
import { UserService } from '../../user/services/user.service';
import Subtask from '../models/subtask.model';
import {
  CREATE_SUBTASK,
  DELETE_SUBTASK,
  UPDATE_SUBTASK,
} from './subtask.queries';
import BaseTask from '../models/base-task.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly ERROR_MESSAGE_DIVIDER = '\n';

  private apollo = inject(Apollo);
  private userService = inject(UserService);

  #tasksView = signal<{ tasks: Task[]; shouldUpdateView: boolean }>({
    tasks: [],
    shouldUpdateView: false,
  });
  #taskToUpdate = signal<{
    taskId: string;
    taskDTO: TaskDTO;
    isTask: boolean;
  } | null>(null);
  #createdTask = signal<Task | null>(null);
  #updatedTask = signal<Task | null>(null);
  #createdSubtask = signal<Subtask | null>(null);
  #updatedSubtask = signal<Subtask | null>(null);
  #taskIdToAddSubtask = signal<string | null>(null);
  #taskWithUpdatedStatus = signal<Task | null>(null);
  #subtaskWithUpdatedStatus = signal<Subtask | null>(null);
  #deletedTask = signal<null | BaseTask>(null);
  #errors = signal<string[]>([]);
  #isTaskFormVisible = signal<boolean>(false);
  #shouldDeleteAllTasks = signal<boolean>(false);

  tasksView = this.#tasksView.asReadonly();
  taskToUpdate = this.#taskToUpdate.asReadonly();
  createdTask = this.#createdTask.asReadonly();
  updatedTask = this.#updatedTask.asReadonly();
  createdSubtask = this.#createdSubtask.asReadonly();
  updatedSubtask = this.#updatedSubtask.asReadonly();
  taskIdToAddSubtask = this.#taskIdToAddSubtask.asReadonly();
  taskWithUpdatedStatus = this.#taskWithUpdatedStatus.asReadonly();
  subtaskWithUpdatedStatus = this.#subtaskWithUpdatedStatus.asReadonly();
  deletedTask = this.#deletedTask.asReadonly();
  errors = this.#errors.asReadonly();
  isTaskFormVisible = this.#isTaskFormVisible.asReadonly();
  shouldDeleteAllTasks = this.#shouldDeleteAllTasks.asReadonly();

  findAllTasks(): void {
    this.findAllTasksBy(FIND_ALL_TASKS, {}, ({ data }: any) =>
      this.#tasksView.set({
        tasks: data.tasks,
        shouldUpdateView: true,
      })
    );
  }

  findAllTasksAssignedToUser(assignedToId: string): void {
    this.findAllTasksBy(
      FIND_ALL_TASKS_ASSIGNED_TO,
      { assignedToId },
      ({ data }: any) =>
        this.#tasksView.set({
          tasks: data.tasksAssignedTo,
          shouldUpdateView: true,
        })
    );
  }

  private findAllTasksBy(
    query: DocumentNode,
    variables: { assignedToId: string } | {},
    onSuccess: (data: any) => void
  ): void {
    this.apollo
      .watchQuery({
        query,
        variables,
        context: this.createContext(),
      })
      .valueChanges.subscribe((data: any) => onSuccess(data));
  }

  subscribeToTaskEvents(): void {
    this.apollo
      .subscribe<any>({
        query: TASK_EVENT,
        context: this.createContext(),
      })
      .subscribe(({ data }) => {
        console.log(data);
        if (!data || !data.taskEvent) {
          return;
        }
        // this.#tasksView.set({
        //   tasks: data.taskEvent,
        //   shouldUpdateView: true,
        // });
      });
  }

  // TODO: Move to parent basic service and create again subtask service
  private createBaseTask(
    mutation: DocumentNode,
    variables:
      | { taskDTO: TaskDTO }
      | { taskId: string | null; subtaskDTO: TaskDTO },
    onSuccess: (data: any) => void
  ): void {
    this.apollo
      .mutate({
        mutation,
        variables,
        context: this.createContext(),
      })
      .subscribe(
        (data: any) => onSuccess(data),
        (error: ApolloError) =>
          this.#errors.set(error.message.split(this.ERROR_MESSAGE_DIVIDER))
      );
  }

  createTask(taskDTO: TaskDTO): void {
    this.createBaseTask(
      CREATE_TASK,
      {
        taskDTO,
      },
      ({ data }: any) => {
        // TODO: Add signal to add task to column
        this.#tasksView.set({
          tasks: [...this.tasksView().tasks, data.createTask],
          shouldUpdateView: false,
        });
        this.#createdTask.set(data.createTask);
        this.changeTaskFormVisibility(false);
      }
    );
  }

  createSubtask(subtaskDTO: TaskDTO): void {
    this.createBaseTask(
      CREATE_SUBTASK,
      {
        taskId: this.taskIdToAddSubtask(),
        subtaskDTO,
      },
      ({ data }: any) => {
        const task = this.tasksView().tasks.filter(
          ({ taskId }) => taskId === this.taskIdToAddSubtask()
        )[0];
        const taskWithNewSubtask = {
          ...task,
          subtasks: [...task.subtasks, data.createSubtask],
        };
        this.#tasksView.set({
          tasks: [
            ...this.tasksView().tasks.filter(
              ({ taskId }) => taskId !== this.taskIdToAddSubtask()
            ),
            taskWithNewSubtask,
          ],
          shouldUpdateView: false,
        });
        this.changeTaskFormVisibility(false);
        this.setTaskIdToAddSubtask(null);
        this.#createdSubtask.set(data.createSubtask);
      }
    );
  }

  private updateBaseTask(
    mutation: DocumentNode,
    variables:
      | { taskId: string | null; taskDTO: TaskDTO }
      | { subtaskId: string | null; subtaskDTO: TaskDTO },
    onSuccess: (data: any) => void
  ): void {
    this.apollo
      .mutate({
        mutation,
        variables,
        context: this.createContext(),
      })
      .subscribe(
        (data: any) => onSuccess(data),
        (error: ApolloError) =>
          this.#errors.set(error.message.split(this.ERROR_MESSAGE_DIVIDER))
      );
  }

  updateTask(taskDTO: TaskDTO): void {
    this.updateBaseTask(
      UPDATE_TASK,
      {
        taskId: this.#taskToUpdate()?.taskId!,
        taskDTO,
      },
      ({ data }: { data: { updateTask: Task } }) => {
        const updatedTask: Task = data.updateTask;
        const taskBeforeUpdate = this.#taskToUpdate()?.taskDTO;
        if (taskDTO.status !== taskBeforeUpdate!!.status) {
          this.#taskWithUpdatedStatus.set(updatedTask);
        }
        this.#tasksView.set({
          tasks: [
            ...this.tasksView().tasks.filter(
              ({ taskId }) => taskId !== updatedTask.taskId
            ),
            updatedTask,
          ],
          shouldUpdateView: false,
        });
        this.#updatedTask.set(updatedTask);
        this.changeTaskFormVisibility(false);
        this.setTaskToUpdate(null, false);
      }
    );
  }

  updateSubtask(subtaskDTO: TaskDTO): void {
    this.updateBaseTask(
      UPDATE_SUBTASK,
      {
        subtaskId: this.#taskToUpdate()?.taskId!,
        subtaskDTO,
      },
      ({ data }: { data: { updateSubtask: Subtask } }) => {
        const updatedSubtask = data.updateSubtask;
        const subtaskBeforeUpdate = this.#taskToUpdate()?.taskDTO;
        const subtaskTask = this.tasksView().tasks.find((task) =>
          task.subtasks.some(
            (subtask) => subtask.subtaskId === updatedSubtask.subtaskId
          )
        )!;
        if (subtaskDTO.status !== subtaskBeforeUpdate!!.status) {
          this.#subtaskWithUpdatedStatus.set(updatedSubtask);
        }
        this.#tasksView.set({
          tasks: [
            ...this.tasksView().tasks.filter(
              ({ taskId }) => taskId !== subtaskTask.taskId
            ),
            {
              ...subtaskTask,
              subtasks: [
                ...subtaskTask.subtasks.filter(
                  ({ subtaskId }) => subtaskId !== updatedSubtask.subtaskId
                ),
                updatedSubtask,
              ],
            },
          ],
          shouldUpdateView: false,
        });
        this.changeTaskFormVisibility(false);
        this.setTaskToUpdate(null, false);
        this.#updatedSubtask.set(updatedSubtask);
      }
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
        context: this.createContext(),
      })
      .subscribe(
        ({ data }: any) => {
          this.#tasksView.set({
            tasks: [
              ...this.tasksView().tasks.filter(
                ({ taskId }) => taskId !== data.updateUserAssignedToTask.taskId
              ),
              data.updateUserAssignedToTask,
            ],
            shouldUpdateView: false,
          });
        },
        (error: ApolloError) =>
          this.#errors.set(error.message.split(this.ERROR_MESSAGE_DIVIDER))
      );
  }

  deleteTask(taskId: string): void {
    this.apollo
      .mutate({
        mutation: DELETE_TASK,
        variables: {
          taskId,
        },
        context: this.createContext(),
      })
      .subscribe(
        () => {
          // TODO: Remove or try to fix
          this.#tasksView.set({
            tasks: [
              ...this.tasksView().tasks.filter(
                ({ taskId: id }) => id !== taskId
              ),
            ],
            shouldUpdateView: false,
          });
        },
        // TODO: Remove or create popup message with errors instead of displaying on task form
        (error: ApolloError) =>
          this.#errors.set(error.message.split(this.ERROR_MESSAGE_DIVIDER))
      );
  }

  deleteAllTasks(): void {
    this.#shouldDeleteAllTasks.set(true);
    this.apollo
      .mutate({
        mutation: DELETE_ALL_TASKS,
        context: this.createContext(),
      })
      .subscribe(() => this.#shouldDeleteAllTasks.set(false));
    // TODO: Display errors?
  }

  deleteSubtask(subtaskId: string): void {
    this.apollo
      .mutate({
        mutation: DELETE_SUBTASK,
        variables: {
          subtaskId,
        },
        context: this.createContext(),
      })
      .subscribe(
        () => {
          const taskWithRemovedSubtask = {
            ...this.tasksView().tasks.find((task) =>
              task.subtasks.some((subtask) => subtask.subtaskId === subtaskId)
            )!!,
          };
          taskWithRemovedSubtask.subtasks =
            taskWithRemovedSubtask.subtasks.filter(
              ({ subtaskId: id }) => id !== subtaskId
            );
          this.#tasksView.set({
            tasks: [
              ...this.tasksView().tasks.filter(
                ({ taskId }) => taskId !== taskWithRemovedSubtask.taskId
              ),
              taskWithRemovedSubtask,
            ],
            shouldUpdateView: false,
          });
        },
        // TODO: Remove or create popup message with errors instead of displaying on task form
        (error: ApolloError) => {}
      );
  }

  setTaskToUpdate(task: BaseTask | null, isTask: boolean): void {
    this.#taskIdToAddSubtask.set(null);
    if (task === null) {
      this.#taskToUpdate.set(null);
    } else {
      this.#taskToUpdate.set({
        taskId: isTask ? task.taskId : (task as Subtask).subtaskId,
        taskDTO: {
          title: task.title,
          description: task.description,
          status: task.status + '',
          priority: task.priority + '',
          targetEndDate: task.targetEndDate,
          assignedTo: this.userService
            .users()
            .find((user) => user.username === task.assignedTo)!!.userId,
        },
        isTask,
      });
    }
  }

  setTaskIdToAddSubtask(id: string | null): void {
    this.#taskToUpdate.set(null);
    this.#taskIdToAddSubtask.set(id);
  }

  setDeletedTask(task: BaseTask): void {
    this.#deletedTask.set(task);
  }

  changeTaskFormVisibility(isTaskFormVisible: boolean): void {
    this.#isTaskFormVisible.set(isTaskFormVisible);
  }

  private createContext(): { headers: HttpHeaders } {
    return {
      headers: this.userService.createAuthorizationHeader(),
    };
  }

  isTask = (task: BaseTask): task is Task =>
    (task as Task).subtasks !== undefined;

  isSubtask = (task: BaseTask): task is Subtask =>
    (task as Subtask).subtaskId !== undefined;
}
