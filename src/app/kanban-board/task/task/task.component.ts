import { Component, input } from '@angular/core';
import Task from '../models/task.model';
import { NgStyle } from '@angular/common';
import TaskColorUtil from '../../utils/task-color.util';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {

  task = input<Task>();
  color = TaskColorUtil.randomColor();

  get priority() {
    const priority = this.task()?.priority.toString() ?? "";
    return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
  }
}
