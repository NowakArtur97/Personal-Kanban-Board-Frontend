import { Component, effect, inject, input } from '@angular/core';
import Task from '../models/task.model';
import { NgStyle } from '@angular/common';
import TaskColorUtil from '../../utils/task-color.util';
import { TaskService } from '../services/task.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { UserService } from '../../user/services/user.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css', '../../common/form.styles.css'],
  animations: [
    trigger('deleteTask', [
      state(
        'default',
        style({
          transform: 'translateY(0)',
        })
      ),
      state(
        'delete',
        style({
          transform: 'translateY(500px)',
          margin: 0,
          padding: 0,
          height: '0px',
          display: 'none',
        })
      ),
      transition('default => delete', [animate('1s')]),
    ]),
  ],
})
export class TaskComponent {
  private taskService = inject(TaskService);
  private userService = inject(UserService);

  task = input<Task>();
  color = TaskColorUtil.randomRareColor();
  deleteTaskState = 'default';
  isDeletingTask = false;
  users = this.userService.users;
  shouldDeleteAllTasks = this.taskService.shouldDeleteAllTasks;

  constructor() {
    effect(() => {
      if (this.shouldDeleteAllTasks()) {
        this.deleteTaskState = 'delete';
      }
    });
  }

  updateTask(): void {
    this.taskService.setTaskToUpdate(this.task()!!);
    this.taskService.changeTaskFormVisibility(true);
  }

  updateAssignedUserToTask(value: string): void {
    this.taskService.updateAssignedUserToTask(this.task()!!.taskId, value);
  }

  startDeleteTaskAnimation(): void {
    this.deleteTaskState = 'delete';
    this.isDeletingTask = true;
  }

  deleteTask(): void {
    if (this.isDeletingTask) {
      this.taskService.deleteTask(this.task()!!.taskId);
    }
  }

  get priority() {
    const priority = this.task()?.priority.toString() ?? '';
    return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
  }
}
