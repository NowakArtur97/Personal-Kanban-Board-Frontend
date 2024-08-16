import { NgClass, NgStyle } from '@angular/common';
import { Component, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { UserService } from '../../user/services/user.service';
import FormUtil from '../../utils/form.util';

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
  errors = this.taskService.errors;

  taskForm = new FormGroup({
    title: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(100),
    ]),
    description: new FormControl(null, [
      Validators.maxLength(1000),
    ]),
    status: new FormControl('READY_TO_START'),
    priority: new FormControl('LOW'),
    targetEndDate: new FormControl(new Date().toISOString().substring(0, 10)),
    assignedTo: new FormControl(this.userService.user().userId)
  }
  );

  minTargetEndDate = new Date().toISOString().split("T")[0];

  createTask(): void {
  }

  emitHideCeateTaskFormEvent(): void {
    this.hideCeateTaskForm.emit();
  }

  formErrors(formControl: FormControl, controlName: string, minLength = 0, maxLength = 0): string[] {
    return FormUtil.formErrors(formControl, controlName, minLength, maxLength);
  }
}
