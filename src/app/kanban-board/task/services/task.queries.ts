import { gql } from 'apollo-angular';

const CREATE_TASK = gql`
    mutation CREATE_TASK($taskDTO: TaskDTO!) {
       createTask(taskDTO: $taskDTO) {
            taskId
            title
            description
            status
            priority
            targetEndDate
            assignedTo
            createdBy
            createdOn
            updatedBy
            updatedOn
        }
    }
`;

const UPDATE_TASK = gql`
    mutation UPDATE_TASK($taskId: UUID!, $taskDTO: TaskDTO!) {
       updateTask(taskId: $taskId, taskDTO: $taskDTO) {
            taskId
            title
            description
            status
            priority
            targetEndDate
            assignedTo
            createdBy
            createdOn
            updatedBy
            updatedOn
        }
    }
`;

const DELETE_TASK = gql`
    mutation DELETE_TASK($taskId: UUID!) {
       deleteTask(taskId: $taskId)
    }
`;

const FIND_ALL_USER_TASKS = gql`
    query FIND_ALL_USER_TASKS {
        tasks {
            taskId
            title
            description
            status
            priority
            targetEndDate
            assignedTo
            createdBy
            createdOn
            updatedBy
            updatedOn
        }
    }
`;

export { CREATE_TASK, UPDATE_TASK, DELETE_TASK, FIND_ALL_USER_TASKS };