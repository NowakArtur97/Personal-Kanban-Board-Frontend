enum TaskStatus {
    ReadyToStart,
    InProgress,
    Done
}

const ALL_TASKS_STATUSES: string[] = Object.keys(TaskStatus).slice(Object.keys(TaskStatus).length / 2);

export { TaskStatus, ALL_TASKS_STATUSES };