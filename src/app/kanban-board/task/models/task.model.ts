import Subtask from './subtask.model';
import BaseTask from './task-basic.model';

export default interface Task extends BaseTask {
  subtasks?: Subtask[];
}
