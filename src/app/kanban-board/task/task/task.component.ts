import {
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  Output,
} from '@angular/core';
import Task from '../models/task.model';
import { NgStyle } from '@angular/common';
import TaskColorUtil from '../../utils/task-color.util';
import { TaskService } from '../services/task.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { UserService } from '../../user/services/user.service';
import { TaskStatus } from '../models/task-status.model';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css', '../../common/form.styles.css'],
  animations: [
    trigger('taskState', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('500ms', style({ transform: 'translateX(0)' })),
      ]),
      state(
        'default',
        style({
          transform: 'translateY(0)',
        })
      ),
      state(
        'removeFromColumn',
        style({
          transform: 'translateX(100%)',
        })
      ),
      state(
        'delete',
        style({
          transform: 'translateY(500px)',
          margin: 0,
          padding: 0,
          height: '0px',
        })
      ),
      transition('default => removeFromColumn', [animate('500ms')]),
      transition('default => delete', [animate('1s')]),
    ]),
  ],
})
export class TaskComponent {
  private taskService = inject(TaskService);
  private userService = inject(UserService);

  task = input<Task>();
  @Output() removedFromColumn = new EventEmitter<string>();
  taskStatus: TaskStatus | null = null;
  color = TaskColorUtil.randomRareColor();
  taskAnimationState = 'default';
  isDeletingTask = false;
  users = this.userService.users;
  taskWithUpdatedStatus = this.taskService.taskWithUpdatedStatus;
  shouldDeleteAllTasks = this.taskService.shouldDeleteAllTasks;
  isRemovingTaskFromColumn = false;

  constructor() {
    effect(() => {
      if (this.shouldDeleteAllTasks()) {
        this.taskAnimationState = 'delete';
      }
    });
    effect(() => {
      const taskWithUpdatedStatus = this.taskWithUpdatedStatus();
      if (
        taskWithUpdatedStatus &&
        taskWithUpdatedStatus.taskId === this.task()!.taskId &&
        this.taskStatus !== taskWithUpdatedStatus.status
      ) {
        this.taskAnimationState = 'removeFromColumn';
        this.isRemovingTaskFromColumn = true;
      }
    });
  }

  ngOnInit() {
    this.taskStatus = this.task()!!.status;
  }

  updateTask(): void {
    this.taskService.setTaskToUpdate(this.task()!!);
    this.taskService.changeTaskFormVisibility(true);
  }

  updateAssignedUserToTask(value: string): void {
    this.taskService.updateAssignedUserToTask(this.task()!!.taskId, value);
  }

  startDeleteTaskAnimation(): void {
    this.taskAnimationState = 'delete';
    this.isDeletingTask = true;
  }

  finishAnimation(): void {
    if (this.isDeletingTask) {
      this.taskService.deleteTask(this.task()!!.taskId);
      this.removedFromColumn.emit(this.task()!!.taskId);
    }
    if (this.isRemovingTaskFromColumn) {
      this.removedFromColumn.emit(this.task()!!.taskId);
    }
  }

  get priority() {
    const priority = this.task()?.priority.toString() ?? '';
    return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
  }
}
