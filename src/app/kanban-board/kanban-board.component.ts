import { Component, effect, inject, OnInit } from '@angular/core';
import { TaskColumnComponent } from './task/task-column/task-column.component';
import { ALL_TASK_STATUSES } from './task/models/task-status.model';
import { TaskFormComponent } from './task/task-form/task-form.component';
import { TaskService } from './task/services/task.service';
import { UserService } from './user/services/user.service';
import UserRole from './user/models/user-role.model';
import { TaskUserSelectionComponent } from './task/task-user-selection/task-user-selection.component';
import { TaskErrorComponent } from './task/task-error/task-error.component';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    TaskColumnComponent,
    TaskFormComponent,
    TaskUserSelectionComponent,
    TaskErrorComponent,
  ],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.css',
})
export class KanbanBoardComponent implements OnInit {
  private taskService = inject(TaskService);
  private userService = inject(UserService);

  taskStatuses = ALL_TASK_STATUSES;
  private user = this.userService.user;
  private lastScrollYPosition = 0;
  isAdmin = false;

  constructor() {
    effect(() => this.setIsAdminValue());
    effect(() => this.handleScrollbarWithTaskForm());
  }

  ngOnInit(): void {
    this.taskService.subscribeToTaskEvents();
    this.taskService.subscribeToSubtaskEvents();
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
    this.taskService.setTaskToUpdate(null, false);
  }

  deleteAllTasks = (): void => this.taskService.deleteAllTasks();

  private setIsAdminValue = (): boolean =>
    (this.isAdmin = this.user().role + '' === UserRole[UserRole.ADMIN]);

  private handleScrollbarWithTaskForm(): void {
    if (this.taskService.isTaskFormVisible()) {
      this.hideScrollbar(true);
    } else {
      this.hideScrollbar(false);
    }
  }
}
