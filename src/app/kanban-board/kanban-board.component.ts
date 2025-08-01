import { Component, effect, inject } from '@angular/core';
import { TaskColumnComponent } from './task/task-column/task-column.component';
import { ALL_TASK_STATUSES } from './task/models/task-status.model';
import { TaskFormComponent } from './task/task-form/task-form.component';
import { TaskService } from './task/services/task.service';
import { UserService } from './user/services/user.service';
import UserRole from './user/models/user-role.model';
import { TaskUserSelectionComponent } from './task/task-user-selection/task-user-selection.component';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [TaskColumnComponent, TaskFormComponent, TaskUserSelectionComponent],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.css',
})
export class KanbanBoardComponent {
  private taskService = inject(TaskService);
  private userService = inject(UserService);

  taskStatuses = ALL_TASK_STATUSES;
  isCeateTaskFormVisible = false;
  user = this.userService.user;
  lastScrollYPosition = 0;

  constructor() {
    effect(() => {
      if (this.taskService.isTaskFormVisible()) {
        this.hideScrollbar(true);
      } else {
        this.hideScrollbar(false);
      }
    });
  }

  private hideScrollbar(shouldHideScrollbar: boolean): void {
    if (shouldHideScrollbar) {
      this.lastScrollYPosition = window.scrollY;
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    } else {
      window.scrollTo(0, this.lastScrollYPosition);
      document.body.style.overflow = 'auto';
    }
  }

  showCreateTaskForm(): void {
    this.taskService.changeTaskFormVisibility(true);
    this.taskService.setTaskToUpdate(null);
  }

  deleteAllTasks(): void {
    this.taskService.deleteAllTasks();
  }

  isAdmin = (): boolean => this.user().role + '' === UserRole[UserRole.ADMIN];
}
