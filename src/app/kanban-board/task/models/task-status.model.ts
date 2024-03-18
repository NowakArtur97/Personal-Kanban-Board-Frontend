enum TaskStatus {
    READY_TO_START,
    IN_PROGRESS,
    DONE
}

const ALL_TASKS_STATUSES: TaskStatus[] = [TaskStatus.READY_TO_START, TaskStatus.IN_PROGRESS, TaskStatus.DONE];

export { TaskStatus, ALL_TASKS_STATUSES };