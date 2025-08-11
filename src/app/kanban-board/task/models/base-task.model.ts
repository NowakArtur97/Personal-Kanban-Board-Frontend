import { TaskPriority } from './task-priority.model';
import { TaskStatus } from './task-status.model';

export default interface BaseTask {
  readonly taskId: string;

  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly targetEndDate: string;

  readonly createdBy: string;
  readonly createdOn: string;
  readonly updatedBy?: string;
  readonly updatedOn?: string;
  readonly assignedTo: string;
}
