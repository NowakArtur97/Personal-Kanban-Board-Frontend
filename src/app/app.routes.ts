import { Routes } from '@angular/router';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import { tasksResolver } from './kanban-board/task/guards/tasks.resolver';
import { UserAuthComponent } from './kanban-board/user/user-auth/user-auth.component';

export const routes: Routes = [
    {
        path: "",
        component: UserAuthComponent,
        title: "Personal Kanban Board",
    },
    {
        path: "kanban-board",
        component: KanbanBoardComponent,
        title: "Personal Kanban Board",
        resolve: { tasks: tasksResolver }
    }
];
