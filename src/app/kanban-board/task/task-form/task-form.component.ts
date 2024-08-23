import { NgClass, NgStyle } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
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
  imports: [ReactiveFormsModule, NgClass, NgStyle],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css', '../../common/form.styles.css'],
})
export class TaskFormComponent implements OnInit {

  private taskService = inject(TaskService);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.userService.findAllUsers();
  }

  constructor() {
    effect(() => {
      if (this.taskToUpdate()) {
        const task = this.taskToUpdate()!!;
        this.taskForm.setValue({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          targetEndDate: task.targetEndDate,
          assignedTo: task.assignedTo
        });
      }
    });
  }
  taskToUpdate = this.taskService.taskToUpdate;
  users = this.userService.users;
  errors = this.taskService.errors;
  isCeateTaskFormVisible = this.taskService.isTaskFormVisible;

  taskForm = new FormGroup({
    title: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(100),
    ]),
    description: new FormControl<string | null>(null, [
      Validators.maxLength(1000),
    ]),
    status: new FormControl<string>('READY_TO_START'),
    priority: new FormControl<string>('LOW'),
    targetEndDate: new FormControl<string>(new Date().toISOString().substring(0, 10)),
    assignedTo: new FormControl<string>(this.userService.user().userId)
  }
  );

  minTargetEndDate = new Date().toISOString().split("T")[0];
  taskStatuses = ALL_TASK_STATUSES;
  taskPriorities = ALL_TASKS_PRIORITIES;

  submitForm(): void {
    if (!this.taskForm.valid) {
      return;
    }
    const { title, description, status, priority, targetEndDate, assignedTo } = this.taskForm.value;
    if (this.taskToUpdate()) {
      const taskDTO: TaskDTO = this.createTaskDTO(title, description, status, priority, targetEndDate, assignedTo);
      this.taskService.updateTask(taskDTO);
    } else {
      const taskDTO: TaskDTO = this.createTaskDTO(title, description, status, priority, targetEndDate, assignedTo);
      this.taskService.createTask(taskDTO);
    }
  }

  private createTaskDTO(
    title: string | null | undefined,
    description: string | null | undefined,
    status: string | null | undefined,
    priority: string | null | undefined,
    targetEndDate: string | null | undefined,
    assignedTo: string | null | undefined
  ): TaskDTO {
    return {
      title: title!!,
      description: description!!,
      status: TaskStatus[TaskStatus[status!! as keyof typeof TaskStatus]],
      priority: TaskPriority[TaskPriority[priority!! as keyof typeof TaskPriority]],
      targetEndDate: targetEndDate!! === "" ? this.minTargetEndDate : targetEndDate!!,
      assignedTo: assignedTo!!,
    };
  };

  emitHideCeateTaskFormEvent(): void {
    this.taskService.changeTaskFormVisibility(false);
  };

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
