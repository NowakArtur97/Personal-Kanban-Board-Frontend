import { Component, inject, input } from '@angular/core';
import Task from '../models/task.model';
import { NgStyle } from '@angular/common';
import TaskColorUtil from '../../utils/task-color.util';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {

  private taskService = inject(TaskService);

  task = input<Task>();
  color = TaskColorUtil.randomColor();

  updateTask(): void {
    this.taskService.setTaskToUpdate(this.task()!!);
    this.taskService.changeTaskFormVisibility(true);
  }

  deleteTask(): void {
    this.taskService.deleteTask(this.task()!!.taskId);
  }

  get priority() {
    const priority = this.task()?.priority.toString() ?? "";
    return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
  }
}
