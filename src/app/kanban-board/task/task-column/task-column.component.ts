import { Component, computed, effect, inject, input } from '@angular/core';
import { TaskStatus } from '../models/task-status.model';
import { TaskService } from '../services/task.service';
import Task from '../models/task.model';
import { TaskComponent } from '../task/task.component';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-task-column',
  standalone: true,
  imports: [NgStyle, TaskComponent],
  templateUrl: './task-column.component.html',
  styleUrl: './task-column.component.css'
})
export class TaskColumnComponent {

  private taskService = inject(TaskService);

  taskStatus = input<TaskStatus>();
  tasks = computed(() =>
    this.taskService.tasks().filter(task =>
      this.hasSameTaskStatus(task)
      || this.hasSameStatusInAnySubtask(task))
  );

  color: string = "";

  // TODO: Remove
  constructor() {
    effect(() => this.randomColor(this.taskStatus() ?? 0));
  }

  get status(): string {
    return TaskStatus[this.taskStatus()!];
  }

  private hasSameStatusInAnySubtask = ({ subtasks }: Task): boolean =>
    subtasks ? subtasks.some(subtask => TaskStatus[subtask.status] === this.status) : false;

  private hasSameTaskStatus = (task: Task): boolean =>
    task.status.toString() === TaskStatus[this.taskStatus()!];

  private randomColor(index: number): void {
    const colors = ["#ef7d57", "#41a6f6", "#566c86"];
    this.color = colors[index];
  };

  formattedStatus = (): string =>
    TaskStatus[this.taskStatus()!]
      .split("_")
      .filter(x => x.length > 0)
      .map((x) => (x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()))
      .join(" ");
}