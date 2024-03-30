import TaskPriority from "./task-priority.model";
import { TaskStatus } from "./task-status.model";

export default interface BaseTask {
    id: string,
    userId: string,

    title: string,
    description: string,
    status: TaskStatus,
    targetEndDate: string,
    createdOn: string,
    createdBy: string,
    updatedOn: string,
    updatedBy: string,
    assignedTo: string,
    priority: TaskPriority,
}