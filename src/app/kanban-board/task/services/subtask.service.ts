import { Injectable, inject, signal } from '@angular/core';
import { ApolloError } from '@apollo/client';
import { Apollo } from 'apollo-angular';
import { UserService } from '../../user/services/user.service';
import { CREATE_SUBTASK, DELETE_SUBTASK } from './subtask.queries';
import TaskDTO from '../models/task.dto';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root',
})
export class SubtaskService {
  private readonly ERROR_MESSAGE_DIVIDER = '\n';

  private apollo = inject(Apollo);
  private taskService = inject(TaskService);
  private userService = inject(UserService);

  #errors = signal<string[]>([]);

  errors = this.#errors.asReadonly();

  createSubtask(subtaskDTO: TaskDTO): void {
    this.apollo
      .mutate({
        mutation: CREATE_SUBTASK,
        variables: {
          taskId: this.taskService.taskIdToAddSubtask(),
          subtaskDTO,
        },
        context: {
          headers: this.userService.createAuthorizationHeader(),
        },
      })
      .subscribe(
        ({ data }: any) =>
          this.taskService.addTaskToSubtask(data.createSubtask),
        (error: ApolloError) =>
          this.#errors.set(error.message.split(this.ERROR_MESSAGE_DIVIDER))
      );
  }

  deleteSubtask(subtaskId: string): void {
    this.apollo
      .mutate({
        mutation: DELETE_SUBTASK,
        variables: {
          subtaskId,
        },
        context: {
          headers: this.userService.createAuthorizationHeader(),
        },
      })
      .subscribe(
        () => {
          // TODO: Remove or try to fix
          // this.#tasks.set([...this.tasks().filter(task => task.taskId !== taskId)]);
        },
        // TODO: Remove or create popup message with errors instead of displaying on task form
        (error: ApolloError) => {}
      );
  }
}
