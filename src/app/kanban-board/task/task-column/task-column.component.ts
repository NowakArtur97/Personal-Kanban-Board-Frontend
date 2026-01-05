import { Component, effect, inject, input } from '@angular/core';
import { TaskStatus } from '../models/task-status.model';
import { TaskService } from '../services/task.service';
import Task from '../models/task.model';
import { TaskComponent } from '../task/task.component';
import { NgFor, NgStyle } from '@angular/common';
import Subtask from '../models/subtask.model';

@Component({
  selector: 'app-task-column',
  standalone: true,
  imports: [NgStyle, TaskComponent, NgFor],
  templateUrl: './task-column.component.html',
  styleUrl: './task-column.component.css',
})
export class TaskColumnComponent {
  private taskService = inject(TaskService);

  taskStatus = input<TaskStatus>();
  displayedTasks: Task[] = [];

  color: string = '';
  private tasksInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    effect(() => this.randomColor(this.taskStatus()!));
    effect(() => this.displayTasks());
    effect(() => this.addTaskToColumn());
    effect(() => this.addTaskToColumnWhenSubtaskCreated());
    effect(() => this.updateTaskInColumn());
    effect(() => this.addUpdatedTaskToColumnIfHasSameStatus());
    effect(() => this.addTaskToColumnIfSubtaskUpdatedHasSameStatus());
  }

  removeFromColumn(taskId: string): void {
    this.displayedTasks = this.displayedTasks.filter(
      ({ taskId: id }) => id !== taskId
    );
  }

  private displayTasks() {
    const { shouldUpdateView, tasks } = this.taskService.tasksView();
    if (shouldUpdateView) {
      this.displayedTasks = [];
    }
    if (!shouldUpdateView || tasks.length === 0) {
      return;
    }
    const tasksInColumn = tasks.filter(
      (task) =>
        this.hasSameTaskStatus(task) ||
        this.hasSameStatusInAnySubtask(task.subtasks)
    );
    if (tasksInColumn.length === 0) {
      return;
    }
    if (this.tasksInterval) {
      clearInterval(this.tasksInterval);
    }
    this.displayedTasks = [];
    let counter = 0;
    this.tasksInterval = setInterval(() => {
      this.displayedTasks.push(tasksInColumn[counter++]);
      if (counter >= tasksInColumn.length) {
        clearInterval(this.tasksInterval!!);
      }
    }, 100);
  }

  private addTaskToColumn(): void {
    const createdTask = this.taskService.createdTask();
    if (!createdTask) {
      return;
    }
    if (this.isTaskOrAnySubtaskInColumn(createdTask)) {
      this.displayedTasks.push(createdTask);
    }
  }

  private addTaskToColumnWhenSubtaskCreated(): void {
    const createdSubtask = this.taskService.createdSubtask();
    if (!createdSubtask) {
      return;
    }
    const taskWithNewSubtask = this.displayedTasks.find(
      ({ taskId }) => taskId === createdSubtask.taskId
    );
    if (!taskWithNewSubtask) {
      const task = this.taskService
        .tasksView()
        .tasks.find(({ taskId }) => taskId === createdSubtask.taskId);
      if (task && this.isTaskOrAnySubtaskInColumn(task)) {
        this.displayedTasks.push(task);
      }
    }
  }

  private updateTaskInColumn(): void {
    const updatedTask = this.taskService.updatedTask();
    if (!updatedTask) {
      return;
    }
    const indexInColumn = this.displayedTasks.findIndex(
      ({ taskId }) => taskId === updatedTask.taskId
    );
    if (
      indexInColumn >= 0 &&
      this.taskService.isTask(updatedTask) &&
      this.isTaskOrAnySubtaskInColumn(updatedTask)
    ) {
      this.displayedTasks[indexInColumn] = updatedTask;
    }
  }

  private addUpdatedTaskToColumnIfHasSameStatus(): void {
    const taskWithUpdatedStatus = this.taskService.taskWithUpdatedStatus();
    if (!taskWithUpdatedStatus) {
      return;
    }
    if (
      this.hasSameTaskStatus(taskWithUpdatedStatus) &&
      this.isTaskInColumn(taskWithUpdatedStatus.taskId)
    ) {
      this.displayedTasks.push(taskWithUpdatedStatus);
    }
  }

  private addTaskToColumnIfSubtaskUpdatedHasSameStatus(): void {
    const subtaskWithUpdatedStatus =
      this.taskService.subtaskWithUpdatedStatus();
    if (
      !subtaskWithUpdatedStatus ||
      !this.hasSameTaskStatus(subtaskWithUpdatedStatus)
    ) {
      return;
    }
    const subtaskTask = this.taskService
      .tasksView()
      .tasks.find(({ taskId }) => taskId === subtaskWithUpdatedStatus.taskId);
    if (subtaskTask && this.isTaskInColumn(subtaskTask?.taskId)) {
      this.displayedTasks.push(subtaskTask);
    }
  }

  private hasSameStatusInAnySubtask = (subtasks: Subtask[]): boolean =>
    subtasks?.some((subtask) => this.hasSameTaskStatus(subtask));

  private hasSameTaskStatus = (task: Task | Subtask): boolean =>
    task.status.toString() === TaskStatus[this.taskStatus()!];

  private randomColor(index: number): void {
    const colors = ['#ef7d57', '#41a6f6', '#566c86'];
    this.color = colors[index];
  }

  private isTaskInColumn = (id: string | undefined) =>
    this.displayedTasks.findIndex(({ taskId }) => taskId === id) === -1;

  private hasSameStatusAsColumn = (status: TaskStatus): boolean =>
    status.toString() === TaskStatus[this.taskStatus()!];

  private isTaskOrAnySubtaskInColumn = (task: Task): boolean =>
    this.hasSameStatusAsColumn(task.status) ||
    task.subtasks.some(({ status }) => this.hasSameStatusAsColumn(status));

  formattedStatus = (): string =>
    TaskStatus[this.taskStatus()!]
      .split('_')
      .filter((x) => x.length > 0)
      .map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
      .join(' ');
}
