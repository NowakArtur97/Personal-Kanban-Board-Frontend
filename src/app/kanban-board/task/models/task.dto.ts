import TaskPriority from "./task-priority.model";
import { TaskStatus } from "./task-status.model";

export default interface TaskDTO {
    title: string,
    description: string,
    status: TaskStatus,
    priority: TaskPriority,
    targetEndDate: string,
    assignedTo: string,
}