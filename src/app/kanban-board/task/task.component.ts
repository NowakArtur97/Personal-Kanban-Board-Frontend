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

  randomColor() {
    let color = '#';
    const letters = '0123456789ABCDEF';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
}
