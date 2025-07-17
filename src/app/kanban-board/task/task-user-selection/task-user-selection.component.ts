import { Component, inject } from '@angular/core';
import { UserService } from '../../user/services/user.service';

@Component({
  selector: 'app-task-user-selection',
  standalone: true,
  imports: [],
  templateUrl: './task-user-selection.component.html',
  styleUrl: './task-user-selection.component.css',
})
export class TaskUserSelectionComponent {
  private userService = inject(UserService);

  users = this.userService.users;
}
