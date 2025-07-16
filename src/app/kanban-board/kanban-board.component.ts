import { Component, inject } from '@angular/core';
import { TaskColumnComponent } from './task/task-column/task-column.component';
import { ALL_TASK_STATUSES } from './task/models/task-status.model';
import { TaskFormComponent } from './task/task-form/task-form.component';
import { TaskService } from './task/services/task.service';
import { UserService } from './user/services/user.service';
import UserRole from './user/models/user-role.model';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [TaskColumnComponent, TaskFormComponent],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.css',
})
export class KanbanBoardComponent {
  private taskService = inject(TaskService);
  private userService = inject(UserService);

  taskStatuses = ALL_TASK_STATUSES;
  isCeateTaskFormVisible = false;
  user = this.userService.user;

  showCreateTaskForm(): void {
    this.taskService.changeTaskFormVisibility(true);
    this.taskService.setTaskToUpdate(null);
  }

  deleteAllTasks() {
    this.taskService.deleteAllTasks();
  }

  isAdmin = (): boolean => this.user().role + '' === UserRole[UserRole.ADMIN];
}
