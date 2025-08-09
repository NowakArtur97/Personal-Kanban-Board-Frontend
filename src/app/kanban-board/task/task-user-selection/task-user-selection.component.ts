import { Component, computed, inject } from '@angular/core';
import { UserService } from '../../user/services/user.service';
import TaskColorUtil from '../../utils/task-color.util';
import { NgStyle } from '@angular/common';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-user-selection',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './task-user-selection.component.html',
  styleUrl: './task-user-selection.component.css',
})
export class TaskUserSelectionComponent {
  readonly ALL_TASKS_SELECTION = 'ALL';

  private userService = inject(UserService);
  private taskService = inject(TaskService);

  users = this.userService.users;
  colors = computed(() => [
    ...this.userService
      .users()
      .map(() =>
        TaskColorUtil.randomColor(TaskColorUtil.PALETTE.PRIMARY_PALETTE)
      ),
    TaskColorUtil.randomColor(TaskColorUtil.PALETTE.PRIMARY_PALETTE),
  ]);

  findAllTasksAssignedToUser(assignedToId: String): void {
    if (assignedToId === this.ALL_TASKS_SELECTION) {
      this.taskService.findAllTasks();
    } else {
      this.taskService.findAllTasksAssignedToUser(assignedToId);
    }
  }
}
