import BaseTask from './base-task.model';
import Subtask from './subtask.model';

export default interface Task extends BaseTask {
  readonly subtasks: Subtask[];
}
