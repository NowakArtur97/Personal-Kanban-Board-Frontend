import { Component, effect, inject } from '@angular/core';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-error',
  standalone: true,
  imports: [],
  templateUrl: './task-error.component.html',
  styleUrl: './task-error.component.css',
})
export class TaskErrorComponent {
  private taskService = inject(TaskService);

  hasErrorOccurred = true;
  errors = this.taskService.errors;

  constructor() {
    effect(
      () => (this.hasErrorOccurred = this.taskService.errors()?.length > 0)
    );
  }

  hideErrorMessages(): void {
    this.hasErrorOccurred = false;
  }
}
