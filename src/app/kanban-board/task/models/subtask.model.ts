import BaseTask from "./task-basic.model";

export default interface Subtask extends BaseTask {
    taskId: string,
}