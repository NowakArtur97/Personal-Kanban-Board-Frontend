import { NgClass, NgStyle } from '@angular/common';
import { Component, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { UserService } from '../../user/services/user.service';
import FormUtil from '../../utils/form.util';
import TaskDTO from '../models/task.dto';
import { ALL_TASK_STATUSES, TaskStatus } from '../models/task-status.model';
import { TaskPriority, ALL_TASKS_PRIORITIES } from '../models/task-priority.model';

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
  taskStatuses = ALL_TASK_STATUSES;
  taskPriorities = ALL_TASKS_PRIORITIES;

  createTask(): void {
    if (!this.taskForm.valid) {
      return;
    }
    const { title, description, status, priority, targetEndDate, assignedTo } = this.taskForm.value;
    console.log(targetEndDate!! === "" ? this.minTargetEndDate : targetEndDate!!);
    const taskDTO: TaskDTO = {
      title: title!!,
      description: description!!,
      status: TaskStatus[TaskStatus[status!! as keyof typeof TaskStatus]],
      priority: TaskPriority[TaskPriority[priority!! as keyof typeof TaskPriority]],
      targetEndDate: targetEndDate!! === "" ? this.minTargetEndDate : targetEndDate!!,
      assignedTo: assignedTo!!,
    };
    this.taskService.createTask(taskDTO);
  }

  emitHideCeateTaskFormEvent(): void {
    this.hideCeateTaskForm.emit();
  }

  formErrors(formControl: FormControl, controlName: string, minLength = 0, maxLength = 0): string[] {
    return FormUtil.formErrors(formControl, controlName, minLength, maxLength);
  }

  status = (tasksStatus: TaskStatus): string => TaskStatus[tasksStatus];

  formattedStatus = (tasksStatus: TaskStatus): string =>
    this.formatEnum(TaskStatus[tasksStatus]);

  priority = (taskPriority: TaskPriority): string => TaskPriority[taskPriority];

  formattedPriority = (taskPriority: TaskPriority): string =>
    this.formatEnum(TaskPriority[taskPriority]);

  formatEnum = (enumValue: string): string =>
    enumValue
      .split("_")
      .filter(x => x.length > 0)
      .map((x, index) => {
        if (index === 0) {
          return x.charAt(0).toUpperCase() + x.slice(1).toLowerCase();
        } else {
          return x.toLowerCase();
        }
      })
      .join(" ");
}
