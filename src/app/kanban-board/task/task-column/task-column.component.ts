import { Component, computed, effect, inject, input } from '@angular/core';
import { TaskStatus } from '../models/task-status.model';
import { TaskService } from '../services/task.service';

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
      TaskStatus[task.status] === this.status));

  constructor() {
    effect(() => {
      console.table(this.tasks());
    });
  }

  get status(): string {
    return TaskStatus[this.tasksStatus()!];
  }
}
