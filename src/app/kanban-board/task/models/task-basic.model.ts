import { TaskPriority } from './task-priority.model';
import { TaskStatus } from './task-status.model';

export default interface BaseTask {
  taskId: string;

  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  targetEndDate: string;

  createdBy: string;
  createdOn: string;
  updatedBy?: string;
  updatedOn?: string;
  assignedTo: string;
}
