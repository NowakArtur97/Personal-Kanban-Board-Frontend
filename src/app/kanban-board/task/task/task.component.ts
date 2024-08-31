import { Component, inject, input } from '@angular/core';
import Task from '../models/task.model';
import { NgStyle } from '@angular/common';
import TaskColorUtil from '../../utils/task-color.util';
import { TaskService } from '../services/task.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
  animations: [
    trigger('deleteTask', [
      state('default', style({
        transform: "translateY(0)"
      })),
      state('delete', style({
        transform: "translateY(500px)",
        margin: 0,
        padding: 0,
        height: "0px",
        display: "none"
      })),
      transition('default => delete', [
        animate('1s')
      ]),
    ]),
  ]
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
