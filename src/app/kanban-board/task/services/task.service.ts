import { Injectable, signal } from '@angular/core';
import Task from '../models/task.model';
import TaskPriority from '../models/task-priority.model';
import { TaskStatus } from '../models/task-status.model';

const EXAMPLE_TASK: Task = {
    id: "3e0fb254-60ad-4614-8972-f783e4f62170",
    userId: "3e0fb254-60ad-4614-8972-f783e4f62170",
    title: "Setup backend repository",
    description: "Create backend repository for Personal Kanbard Board application",
    status: TaskStatus.InProgress,
    priority: TaskPriority.MEDIUM,
    targetEndDate: "",
    createdOn: "Tuesday, Aug 16, 2016 12:10:56 PM",
    createdBy: "Arthur Smith",
    updatedOn: "Tuesday, Aug 16, 2016 12:10:56 PM",
    updatedBy: "Andrew Smith",
    assignedTo: "Andrew Smith",
    subtasks: []
};
const TEMP_TASKS: Task[] = [
    {
        ...EXAMPLE_TASK,
        status: TaskStatus.ReadyToStart,
        priority: TaskPriority.MEDIUM,
        subtasks: []
    },
    {
        ...EXAMPLE_TASK,
        status: TaskStatus.ReadyToStart,
        priority: TaskPriority.MEDIUM,
        subtasks: []
    },
    {
        ...EXAMPLE_TASK,
        status: TaskStatus.InProgress,
        priority: TaskPriority.MEDIUM,
        subtasks: []
    },
    {
        ...EXAMPLE_TASK,
        status: TaskStatus.InProgress,
        priority: TaskPriority.MEDIUM,
        subtasks: []
    },
    {
        ...EXAMPLE_TASK,
        status: TaskStatus.InProgress,
        priority: TaskPriority.MEDIUM,
        subtasks: []
    },
    {
        ...EXAMPLE_TASK,
        status: TaskStatus.Done,
        priority: TaskPriority.MEDIUM,
        subtasks: []
    },
];

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    #tasks = signal<Task[]>(TEMP_TASKS);

    tasks = this.#tasks.asReadonly();
}