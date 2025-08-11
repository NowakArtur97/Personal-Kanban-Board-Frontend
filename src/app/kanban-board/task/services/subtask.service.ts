import { Injectable, inject } from '@angular/core';
import { ApolloError } from '@apollo/client';
import { Apollo } from 'apollo-angular';
import { UserService } from '../../user/services/user.service';
import { DELETE_SUBTASK } from './subtask.queries';

@Injectable({
  providedIn: 'root',
})
export class SubtaskService {
  private apollo = inject(Apollo);
  private userService = inject(UserService);

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
