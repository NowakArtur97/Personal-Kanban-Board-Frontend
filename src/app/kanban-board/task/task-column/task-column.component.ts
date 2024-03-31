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

  tasksStatus = input<TaskStatus>();
  tasks = computed(() =>
    this.taskService.tasks().filter(task =>
      this.hasSameTaskStatus(task)
      || this.hasSameStatusInAnySubtask(task)));

  color: string = "";

  // TODO: Remove
  constructor() {
    effect(() => {
      console.table(this.tasks());
      this.randomColor(this.tasksStatus() ?? 0);
    });
  }

  get status(): string {
    return TaskStatus[this.tasksStatus()!];
  }

  private hasSameStatusInAnySubtask = (task: Task): boolean =>
    task.subtasks.some(subtask => TaskStatus[subtask.status] === this.status);

  private hasSameTaskStatus = (task: Task): boolean =>
    TaskStatus[task.status] === this.status;

  private randomColor(index: number): void {
    const colors = ["#ef7d57", "#41a6f6", "#566c86"];
    this.color = colors[index];
  };

  formattedStatus = (): string =>
    TaskStatus[this.tasksStatus()!].replace(/([A-Z])/g, ' $1').trim();
}