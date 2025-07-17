import { Component, inject } from '@angular/core';
import { UserService } from '../../user/services/user.service';
import TaskColorUtil from '../../utils/task-color.util';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-task-user-selection',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './task-user-selection.component.html',
  styleUrl: './task-user-selection.component.css',
})
export class TaskUserSelectionComponent {
  private userService = inject(UserService);

  users = this.userService.users;

  getRandomColor(): String {
    return TaskColorUtil.randomColor();
  }
}
