import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ALL_TASKS_STATUSES } from './task/models/task-status';
import { TaskColumnComponent } from './task/task-column/task-column.component';

@Component({
    selector: 'app-kanban-board',
    standalone: true,
    imports: [NgFor, TaskColumnComponent],
    templateUrl: './kanban-board.component.html',
    styleUrl: './kanban-board.component.css'
})
export class KanbanBoardComponent {

    tasksStatuses = ALL_TASKS_STATUSES;
}