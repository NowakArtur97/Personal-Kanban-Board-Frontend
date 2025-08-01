import BaseTask from './task-basic.model';

export default interface Subtask extends BaseTask {
  subtaskId: string;
  taskId: string;
}
