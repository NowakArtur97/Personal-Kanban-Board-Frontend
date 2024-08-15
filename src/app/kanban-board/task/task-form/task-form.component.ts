import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {

  taskForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(100),
    ]),
    description: new FormControl('', [
      Validators.maxLength(1000),
    ]),
    status: new FormControl('In progress'),
    priority: new FormControl('Low'),
    targetEndDate: new FormControl(new Date().toISOString().substring(0, 10)),
    assignedTo: new FormControl('')
  }
  );
}
