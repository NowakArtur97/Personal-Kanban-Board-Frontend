import { NgClass, NgStyle } from '@angular/common';
import { Component, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { UserService } from '../../user/services/user.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [NgClass, NgStyle, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css', '../../common/form.styles.css'],
})
export class TaskFormComponent implements OnInit {

  private taskService = inject(TaskService);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.userService.findAllUsers();
  }

  isCeateTaskFormVisible = input<boolean>(false);
  @Output() hideCeateTaskForm = new EventEmitter<boolean>();
  users = this.userService.users;

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

  minTargetEndDate = new Date().toISOString().split("T")[0];

  createTask(): void {
  }

  emitHideCeateTaskFormEvent(): void {
    this.hideCeateTaskForm.emit();
  }
}
