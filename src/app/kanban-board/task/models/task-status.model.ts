enum TaskStatus {
    ReadyToStart,
    InProgress,
    Done
}

const ALL_TASKS_STATUSES: TaskStatus[] = [TaskStatus.ReadyToStart, TaskStatus.InProgress, TaskStatus.Done];

export { TaskStatus, ALL_TASKS_STATUSES };