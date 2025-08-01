import { Component, effect, inject, input } from '@angular/core';
import { TaskStatus } from '../models/task-status.model';
import { TaskService } from '../services/task.service';
import Task from '../models/task.model';
import { TaskComponent } from '../task/task.component';
import { NgFor, NgStyle } from '@angular/common';

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
  #tasksInterval: null | ReturnType<typeof setInterval> = null;

  constructor() {
    effect(() => this.randomColor(this.taskStatus() ?? 0)); // TODO: Remove
    effect(() => this.displayTasks(this.filterTasksForColumn()));
    effect(() => this.addUpdatedTaskToColumnIfHasSameStatus());
  }

  get status(): string {
    return TaskStatus[this.taskStatus()!];
  }

  removeFromColumn(taskId: string): void {
    this.displayedTasks = this.displayedTasks.filter(
      (task) => task.taskId !== taskId
    );
  }

  private displayTasks(tasks: Task[]) {
    let counter = 0;
    this.displayedTasks = [];
    if (tasks.length === 0) {
      return;
    }
    if (this.#tasksInterval) {
      clearInterval(this.#tasksInterval);
    }
    this.#tasksInterval = setInterval(() => {
      this.displayedTasks.push(tasks[counter++]);
      if (counter >= tasks.length) {
        clearInterval(this.#tasksInterval!!);
      }
    }, 100);
  }

  private filterTasksForColumn = (): Task[] =>
    this.taskService
      .tasks()
      .filter(
        (task) =>
          this.hasSameTaskStatus(task) || this.hasSameStatusInAnySubtask(task)
      );

  private addUpdatedTaskToColumnIfHasSameStatus() {
    const taskWithUpdatedStatus = this.taskService.taskWithUpdatedStatus();
    if (!taskWithUpdatedStatus) {
      return;
    }
    const hasSameTaskStatus = this.hasSameTaskStatus(taskWithUpdatedStatus);
    if (hasSameTaskStatus) {
      this.displayedTasks.push(taskWithUpdatedStatus);
    }
  }

  private hasSameStatusInAnySubtask = ({ subtasks }: Task): boolean =>
    subtasks
      ? subtasks.some((subtask) => TaskStatus[subtask.status] === this.status)
      : false;

  private hasSameTaskStatus = (task: Task): boolean =>
    task.status.toString() === TaskStatus[this.taskStatus()!];

  private randomColor(index: number): void {
    const colors = ['#ef7d57', '#41a6f6', '#566c86'];
    this.color = colors[index];
  }

  formattedStatus = (): string =>
    TaskStatus[this.taskStatus()!]
      .split('_')
      .filter((x) => x.length > 0)
      .map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
      .join(' ');
}
