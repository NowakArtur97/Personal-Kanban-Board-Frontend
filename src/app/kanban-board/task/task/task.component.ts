import {
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  Output,
} from '@angular/core';
import { NgClass, NgFor, NgStyle } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { UserService } from '../../user/services/user.service';
import Subtask from '../models/subtask.model';
import TaskColorUtil from '../../utils/task-color.util';
import BaseTask from '../models/base-task.model';
import { TaskStatus } from '../models/task-status.model';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [NgStyle, NgFor, NgClass],
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
          transform: 'translateX(100%)',
        })
      ),
      transition('default => removeFromColumn', [animate('500ms')]),
      transition('default => delete', [animate('500ms')]),
    ]),
  ],
})
export class TaskComponent {
  private taskService = inject(TaskService);
  private userService = inject(UserService);

  task = input<BaseTask>();
  columnStatus = input<TaskStatus>();
  @Output() removedFromColumn = new EventEmitter<string>();
  @Output() removedFromSubtasks = new EventEmitter<string>();
  private taskStatus: TaskStatus | null = null;
  color: string = '';
  taskAnimationState = 'default';
  private isDeletingTask = false;
  users = this.userService.users;
  private taskWithUpdatedStatus = this.taskService.taskWithUpdatedStatus;
  private shouldDeleteAllTasks = this.taskService.shouldDeleteAllTasks;
  private isRemovingTaskFromColumn = false;
  displayedSubtasks: Subtask[] = [];

  constructor() {
    effect(() => this.updateSubtask());
    effect(() => this.startRemoveTaskAnimationOnDeleteTask());
    effect(() => this.startRemoveTaskAnimationOnDeleteAllTasks());
    effect(() =>
      this.startRemoveTaskFromColumnAnimationOnRemoveTaskFromColumn()
    );
  }

  ngOnInit() {
    const task = this.task()!!;
    this.taskStatus = task.status;
    this.color = TaskColorUtil.randomRareColor(
      this.isTask()
        ? TaskColorUtil.PALETTE.PRIMARY_PALETTE
        : TaskColorUtil.PALETTE.SECONDARY_PALETTe
    );
    if (this.taskService.isTask(task)) {
      this.displayedSubtasks = task.subtasks.filter(({ status }) =>
        this.hasSameStatusAsColumn(status)
      );
    }
  }

  updateTask(event: Event): void {
    event.stopPropagation();
    const task = this.task()!!;
    this.taskService.setTaskToUpdate(task, this.isTask());
    this.taskService.changeTaskFormVisibility(true);
  }

  addSubtask(): void {
    const task = this.task()!!;
    if (this.isTask()) {
      this.taskService.setTaskIdToAddSubtask(task.taskId);
      this.taskService.changeTaskFormVisibility(true);
    }
  }

  updateAssignedUserToTask = (value: string): void =>
    this.taskService.updateAssignedUserToTask(this.task()!!.taskId, value);

  startDeleteTaskAnimation(): void {
    this.taskAnimationState = 'delete';
    this.isDeletingTask = true;
    const task = this.task()!;
    this.taskService.setDeletedTask(task);
    setTimeout(() => {
      if (this.isTask()) {
        this.taskService.deleteTask(task.taskId);
      } else {
        this.taskService.deleteSubtask((task as Subtask).subtaskId);
      }
    }, 500);
  }

  finishAnimation(): void {
    if (this.isDeletingTask || this.isRemovingTaskFromColumn) {
      const task = this.task()!;
      this.removedFromColumn.emit(task.taskId);
      if (this.taskService.isSubtask(task)) {
        this.removedFromSubtasks.emit(task.subtaskId);
      }
    }
  }

  removeFromSubtasks(subtaskId: string): void {
    this.displayedSubtasks = this.displayedSubtasks.filter(
      ({ subtaskId: id }) => id !== subtaskId
    );
  }

  private updateSubtask(): void {
    const updatedSubtask = this.taskService.updatedSubtask();
    if (!updatedSubtask) {
      return;
    }
    const task = this.task()!;
    const indexOfSubtaskInSubtasks = this.taskService.isTask(task)
      ? this.displayedSubtasks.findIndex(
          ({ subtaskId }) => subtaskId === updatedSubtask?.subtaskId
        )
      : -1;
    const hasSameStatus = this.hasSameStatusAsColumn(updatedSubtask.status);
    if (indexOfSubtaskInSubtasks >= 0 && hasSameStatus) {
      this.displayedSubtasks[indexOfSubtaskInSubtasks] = updatedSubtask;
    }
  }

  // TODO: Effect for removing subtask from subtasks if status changed
  // TODO: Effect for removing task from column when there are no subtasks with column status and task has different status than column

  private startRemoveTaskAnimationOnDeleteTask(): void {
    const deletedTask = this.taskService.deletedTask();
    if (!deletedTask) {
      return;
    }
    const task = this.task()!;
    const isSameTask =
      this.taskService.isTask(deletedTask) &&
      deletedTask.taskId === task.taskId;
    const isSameSubtask =
      this.taskService.isSubtask(task) &&
      this.taskService.isSubtask(deletedTask) &&
      deletedTask.subtaskId === task.subtaskId;
    if (isSameTask || isSameSubtask) {
      this.taskAnimationState = 'delete';
      this.isDeletingTask = true;
    }
  }

  private startRemoveTaskAnimationOnDeleteAllTasks(): void {
    if (this.shouldDeleteAllTasks()) {
      this.taskAnimationState = 'delete';
    }
  }

  private startRemoveTaskFromColumnAnimationOnRemoveTaskFromColumn() {
    const taskWithUpdatedStatus = this.taskWithUpdatedStatus();
    const isSameTaskWithUpdatedStatus =
      taskWithUpdatedStatus?.taskId === this.task()!.taskId &&
      taskWithUpdatedStatus.status !== this.taskStatus;
    const task = this.task()!;
    if (
      this.taskService.isTask(task) &&
      !task.subtasks.some(({ status }) => this.hasSameStatusAsColumn(status)) &&
      isSameTaskWithUpdatedStatus
    ) {
      this.taskAnimationState = 'removeFromColumn';
      this.isRemovingTaskFromColumn = true;
    }
  }

  get priority() {
    const priority = this.task()?.priority.toString() ?? '';
    return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
  }

  isTask = (): boolean => this.taskService.isTask(this.task()!);

  private hasSameStatusAsColumn = (status: TaskStatus): boolean =>
    status.toString() === TaskStatus[this.columnStatus()!];
}
