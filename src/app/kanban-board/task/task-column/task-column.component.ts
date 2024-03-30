import { Component, computed, effect, inject, input } from '@angular/core';
import { TaskStatus } from '../models/task-status.model';
import { TaskService } from '../services/task.service';
import Task from '../models/task.model';

@Component({
  selector: 'app-task-column',
  standalone: true,
  imports: [],
  templateUrl: './task-column.component.html',
  styleUrl: './task-column.component.css'
})
export class TaskColumnComponent {

  private taskService = inject(TaskService);

  tasksStatus = input<TaskStatus>();

  private tasks = computed(() =>
    this.taskService.tasks().filter(task =>
      this.hasSameTaskStatus(task)
      || this.hasSameStatusInAnySubtask(task)));

  constructor() {
    effect(() => {
      console.table(this.tasks());
    });
  }

  private hasSameStatusInAnySubtask = (task: Task): boolean =>
    task.subtasks.some(subtask => TaskStatus[subtask.status] === this.status);

  private hasSameTaskStatus = (task: Task): boolean =>
    TaskStatus[task.status] === this.status;

  get status(): string {
    return TaskStatus[this.tasksStatus()!];
  }
}