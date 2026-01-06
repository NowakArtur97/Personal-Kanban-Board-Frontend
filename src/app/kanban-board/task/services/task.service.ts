import { Injectable, WritableSignal, inject, signal } from '@angular/core';
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
  DELETE_ALL_SUBTASKS_BY_TASK_ID,
  DELETE_SUBTASK,
  SUBTASK_EVENT,
  UPDATE_SUBTASK,
  UPDATE_USER_ASSIGNED_TO_SUBTASK,
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
  #deletedTask = signal<BaseTask | null>(null);
  #createdSubtask = signal<Subtask | null>(null);
  #updatedSubtask = signal<Subtask | null>(null);
  #deletedSubtaskId = signal<string | null>(null);
  #taskIdToAddSubtask = signal<string | null>(null);
  #taskWithUpdatedStatus = signal<Task | null>(null);
  #taskIdToDeleteSubtasks = signal<string | null>(null);
  #subtaskWithUpdatedStatus = signal<Subtask | null>(null);
  #formErrors = signal<string[]>([]);
  #errors = signal<string[]>([]);
  #isTaskFormVisible = signal<boolean>(false);
  #shouldDeleteAllTasks = signal<boolean>(false);

  tasksView = this.#tasksView.asReadonly();
  taskToUpdate = this.#taskToUpdate.asReadonly();
  createdTask = this.#createdTask.asReadonly();
  updatedTask = this.#updatedTask.asReadonly();
  deletedTask = this.#deletedTask.asReadonly();
  createdSubtask = this.#createdSubtask.asReadonly();
  updatedSubtask = this.#updatedSubtask.asReadonly();
  deletedSubtaskId = this.#deletedSubtaskId.asReadonly();
  taskIdToAddSubtask = this.#taskIdToAddSubtask.asReadonly();
  taskWithUpdatedStatus = this.#taskWithUpdatedStatus.asReadonly();
  taskIdToDeleteSubtasks = this.#taskIdToDeleteSubtasks.asReadonly();
  subtaskWithUpdatedStatus = this.#subtaskWithUpdatedStatus.asReadonly();
  formErrors = this.#formErrors.asReadonly();
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
      .query({
        query,
        variables,
        context: this.createContext(),
        fetchPolicy: 'network-only',
      })
      .subscribe((data: any) => onSuccess(data));
  }

  subscribeToTaskEvents(): void {
    this.apollo
      .subscribe<any>({
        query: TASK_EVENT,
        context: this.createContext(),
      })
      .subscribe(({ data }) => {
        if (!data || !data.taskEvent) {
          return;
        }
        switch (data.taskEvent.taskEventType) {
          case 'CREATE':
            this.handleTaskCreation(data.taskEvent.task);
            break;
          case 'UPDATE':
            this.handleTaskUpdate(data.taskEvent.task);
            break;
          case 'DELETE':
            this.handleTaskDeletion(data.taskEvent.taskId);
            break;
          case 'DELETE_ALL':
            if (!this.#shouldDeleteAllTasks()) {
              this.handlAllTaskDeletion();
            }
            break;
        }
      });
  }

  subscribeToSubtaskEvents(): void {
    this.apollo
      .subscribe<any>({
        query: SUBTASK_EVENT,
        context: this.createContext(),
      })
      .subscribe(({ data }) => {
        if (!data || !data.subtaskEvent) {
          return;
        }
        switch (data.subtaskEvent.taskEventType) {
          case 'CREATE':
            this.handleSubtaskCreation(data.subtaskEvent.task);
            break;
          case 'UPDATE':
            this.handleSubtaskUpdate(data.subtaskEvent.task);
            break;
          case 'DELETE':
            this.handleSubtaskDeletion(data.subtaskEvent.taskId);
            break;
          case 'DELETE_ALL_SUBTASKS_FOR_TASK':
            this.handleAllSubtasksDeletionByTaskId(data.subtaskEvent.taskId);
            break;
        }
      });
  }

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
        (error: ApolloError) => this.setErrors(this.#formErrors, error)
      );
  }

  createTask(taskDTO: TaskDTO): void {
    this.createBaseTask(
      CREATE_TASK,
      {
        taskDTO,
      },
      ({ data }: any) => this.handleTaskCreation(data.createTask)
    );
  }

  private handleTaskCreation(task: Task): void {
    if (this.tasksView().tasks.some(({ taskId }) => taskId === task.taskId)) {
      return;
    }
    this.#tasksView.set({
      tasks: [...this.tasksView().tasks, task],
      shouldUpdateView: false,
    });
    this.#createdTask.set(task);
    this.changeTaskFormVisibility(false);
  }

  // Fix issue with displaying new subtask with column without parent task
  createSubtask(subtaskDTO: TaskDTO): void {
    this.createBaseTask(
      CREATE_SUBTASK,
      {
        taskId: this.taskIdToAddSubtask(),
        subtaskDTO,
      },
      ({ data }: any) => this.handleSubtaskCreation(data.createSubtask)
    );
  }

  private handleSubtaskCreation(subtask: Subtask): void {
    if (
      this.tasksView().tasks.some(({ subtasks }) =>
        subtasks.some(({ subtaskId }) => subtaskId === subtask.subtaskId)
      )
    ) {
      return;
    }
    const task = this.tasksView().tasks.find(
      ({ taskId }) => taskId === subtask.taskId
    );
    if (!task) {
      return;
    }
    const taskWithNewSubtask = {
      ...task,
      subtasks: [...task.subtasks, subtask],
    };
    this.#tasksView.set({
      tasks: [
        ...this.tasksView().tasks.filter(
          ({ taskId }) => taskId !== subtask.taskId
        ),
        taskWithNewSubtask,
      ],
      shouldUpdateView: false,
    });
    this.#createdSubtask.set(subtask);
    this.changeTaskFormVisibility(false);
    this.setTaskIdToAddSubtask(null);
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
        (error: ApolloError) => this.setErrors(this.#formErrors, error)
      );
  }

  updateTask(taskDTO: TaskDTO): void {
    this.updateBaseTask(
      UPDATE_TASK,
      {
        taskId: this.#taskToUpdate()?.taskId!,
        taskDTO,
      },
      ({ data }: { data: { updateTask: Task } }) =>
        this.handleTaskUpdate(data.updateTask)
    );
  }

  private handleTaskUpdate(updatedTask: Task): void {
    const taskBeforeUpdate = this.tasksView().tasks.find(
      ({ taskId }) => taskId === updatedTask.taskId
    );
    if (!taskBeforeUpdate) {
      return;
    }
    if (updatedTask.status !== taskBeforeUpdate!!.status) {
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

  updateSubtask(subtaskDTO: TaskDTO): void {
    this.updateBaseTask(
      UPDATE_SUBTASK,
      {
        subtaskId: this.#taskToUpdate()?.taskId!,
        subtaskDTO,
      },
      ({ data }: { data: { updateSubtask: Subtask } }) =>
        this.handleSubtaskUpdate(data.updateSubtask)
    );
  }

  private handleSubtaskUpdate(updatedSubtask: Subtask): void {
    const taskBeforeUpdate = this.tasksView().tasks.find(
      ({ taskId }) => taskId === updatedSubtask.taskId
    );
    if (!taskBeforeUpdate) {
      return;
    }
    const subtaskBeforeUpdate = taskBeforeUpdate.subtasks.find(
      ({ subtaskId }) => subtaskId === updatedSubtask.subtaskId
    );
    const subtaskTask = this.tasksView().tasks.find((task) =>
      task.subtasks.some(
        (subtask) => subtask.subtaskId === updatedSubtask.subtaskId
      )
    )!;
    if (updatedSubtask.status !== subtaskBeforeUpdate!!.status) {
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
    this.#updatedSubtask.set(updatedSubtask);
    this.changeTaskFormVisibility(false);
    this.setTaskToUpdate(null, false);
  }

  updateAssignedUserToTask = (taskId: string, assignedToId: string): void =>
    this.updateAssignedUserToBaseTask(
      UPDATE_USER_ASSIGNED_TO_TASK,
      {
        taskId,
        assignedToId,
      },
      ({ data }: any) => this.handleTaskUpdate(data.updateUserAssignedToTask)
    );

  updateAssignedUserToSubtask = (
    subtaskId: string,
    assignedToId: string
  ): void =>
    this.updateAssignedUserToBaseTask(
      UPDATE_USER_ASSIGNED_TO_SUBTASK,
      {
        subtaskId,
        assignedToId,
      },
      ({ data }: any) =>
        this.handleSubtaskUpdate(data.updateUserAssignedToSubtask)
    );

  private updateAssignedUserToBaseTask(
    mutation: DocumentNode,
    variables:
      | { taskId: string | null; assignedToId: string }
      | { subtaskId: string | null; assignedToId: string },
    onSuccess: (data: any) => void
  ): void {
    this.apollo
      .mutate({
        mutation,
        variables,
        context: this.createContext(),
      })
      .subscribe(onSuccess, (error: ApolloError) =>
        this.setErrors(this.#errors, error)
      );
  }

  private delete(
    mutation: DocumentNode,
    variables: { taskId: string } | { subtaskId: string },
    onSuccess: () => void
  ): void {
    this.apollo
      .mutate({
        mutation,
        variables,
        context: this.createContext(),
      })
      .subscribe(
        () => onSuccess(),
        (error: ApolloError) => this.setErrors(this.#errors, error)
      );
  }

  deleteTask = (taskId: string): void =>
    this.delete(
      DELETE_TASK,
      {
        taskId,
      },
      () => this.handleTaskDeletion(taskId)
    );

  private handleTaskDeletion(taskId: string): void {
    const deletedTask = this.tasksView().tasks.find(
      ({ taskId: id }) => id === taskId
    );
    if (!deletedTask) {
      return;
    }
    this.#tasksView.set({
      tasks: [
        ...this.tasksView().tasks.filter(({ taskId: id }) => id !== taskId),
      ],
      shouldUpdateView: false,
    });
    this.#deletedTask.set(deletedTask);
  }

  deleteSubtask = (subtaskId: string): void =>
    this.delete(
      DELETE_SUBTASK,
      {
        subtaskId,
      },
      () => this.handleSubtaskDeletion(subtaskId)
    );

  private handleSubtaskDeletion(subtaskId: string): void {
    const taskWithRemovedSubtask = this.tasksView().tasks.find((task) =>
      task.subtasks.some((subtask) => subtask.subtaskId === subtaskId)
    );
    if (
      !taskWithRemovedSubtask ||
      (this.isTask(taskWithRemovedSubtask) &&
        taskWithRemovedSubtask.subtasks.length === 0)
    ) {
      return;
    }
    const taskWithoutSubtask = {
      ...taskWithRemovedSubtask,
    };
    taskWithoutSubtask.subtasks = taskWithRemovedSubtask.subtasks.filter(
      ({ subtaskId: id }) => id !== subtaskId
    );
    this.#tasksView.set({
      tasks: [
        ...this.tasksView().tasks.filter(
          ({ taskId }) => taskId !== taskWithoutSubtask.taskId
        ),
        taskWithoutSubtask,
      ],
      shouldUpdateView: false,
    });
    this.#deletedSubtaskId.set(subtaskId);
  }

  deleteAllSubtasksByTaskId = (taskId: string): void =>
    this.delete(
      DELETE_ALL_SUBTASKS_BY_TASK_ID,
      {
        taskId,
      },
      () => this.handleAllSubtasksDeletionByTaskId(taskId)
    );

  private handleAllSubtasksDeletionByTaskId(
    taskIdToDeleteSubtasks: string
  ): void {
    const taskToRemoveSubtasks = this.tasksView().tasks.find(
      ({ taskId }) => taskId === taskIdToDeleteSubtasks
    );
    if (!taskToRemoveSubtasks) {
      return;
    }
    const taskWithoutSubtasks = {
      ...taskToRemoveSubtasks,
      subtasks: [],
    };
    this.#tasksView.set({
      tasks: [
        ...this.tasksView().tasks.filter(
          ({ taskId }) => taskId !== taskIdToDeleteSubtasks
        ),
        taskWithoutSubtasks,
      ],
      shouldUpdateView: false,
    });
    this.#taskIdToDeleteSubtasks.set(taskIdToDeleteSubtasks);
  }

  deleteAllTasks(): void {
    this.apollo
      .mutate({
        mutation: DELETE_ALL_TASKS,
        context: this.createContext(),
      })
      .subscribe(
        () => this.handlAllTaskDeletion(),
        (error: ApolloError) => this.setErrors(this.#errors, error)
      );
  }

  private handlAllTaskDeletion(): void {
    this.#shouldDeleteAllTasks.set(true);
    setTimeout(() => this.#shouldDeleteAllTasks.set(false), 1000);
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

  changeTaskFormVisibility = (isTaskFormVisible: boolean): void =>
    this.#isTaskFormVisible.set(isTaskFormVisible);

  private createContext(): { headers: HttpHeaders } {
    return {
      headers: this.userService.createAuthorizationHeader(),
    };
  }

  private setErrors = (
    errors: WritableSignal<string[]>,
    error: ApolloError
  ): void => errors.set(error.message.split(this.ERROR_MESSAGE_DIVIDER));

  isTask = (task: BaseTask): task is Task =>
    (task as Task).subtasks !== undefined;

  isSubtask = (task: BaseTask): task is Subtask =>
    (task as Subtask).subtaskId !== undefined;
}
