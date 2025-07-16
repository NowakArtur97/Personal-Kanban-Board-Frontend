import { Routes } from '@angular/router';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import { UserAuthComponent } from './kanban-board/user/user-auth/user-auth.component';
import { tasksResolver } from './kanban-board/task/guards/tasks.resolver';
import { isAuthenticated } from './kanban-board/user/guards/is-authenticated.guard';

const title = 'Personal Kanban Board';

export const PATHS = {
  DEFAULT: '',
  KANBAN_BOARD: 'kanban-board',
};

export const routes: Routes = [
  {
    path: PATHS.DEFAULT,
    component: UserAuthComponent,
    title,
  },
  {
    path: PATHS.KANBAN_BOARD,
    component: KanbanBoardComponent,
    title,
    resolve: { tasks: tasksResolver },
    canActivate: [isAuthenticated],
  },
];
