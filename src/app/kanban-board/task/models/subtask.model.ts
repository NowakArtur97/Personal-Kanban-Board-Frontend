import BaseTask from './base-task.model';

export default interface Subtask extends BaseTask {
  readonly subtaskId: string;
}
