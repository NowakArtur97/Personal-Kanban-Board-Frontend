import { Component, input } from '@angular/core';
import Task from '../models/task.model';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {

  task = input<Task>();
  color = this.randomColor();

  private randomColor(): string {
    const colors = ["#94b0c2", "#73eff7", "#a7f070", "#ffcd75"];
    return colors[Math.floor(Math.random() * colors.length)];
  };
}
