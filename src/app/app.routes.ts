import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { tasksResolver } from './kanban-board/task/guards/tasks.resolver';

export const routes: Routes = [
    {
        path: "",
        component: AppComponent,
        title: "Personal Kanban Board",
        resolve: { tasks: tasksResolver }
    }
];
