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

const UPDATE_USER_ASSIGNED_TO_TASK = gql`
  mutation UPDATE_USER_ASSIGNED_TO_TASK($taskId: UUID!, $assignedToId: UUID!) {
    updateUserAssignedToTask(taskId: $taskId, assignedToId: $assignedToId) {
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

const DELETE_ALL_TASKS = gql`
  mutation DELETE_ALL_TASKS {
    deleteAllTasks
  }
`;

const FIND_ALL_TASKS = gql`
  query FIND_ALL_TASKS {
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
      subtasks {
        subtaskId
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
  }
`;

const FIND_ALL_TASKS_ASSIGNED_TO = gql`
  query FIND_ALL_TASKS_ASSIGNED_TO($assignedToId: UUID!) {
    tasksAssignedTo(assignedToId: $assignedToId) {
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

export {
  CREATE_TASK,
  UPDATE_TASK,
  UPDATE_USER_ASSIGNED_TO_TASK,
  DELETE_TASK,
  DELETE_ALL_TASKS,
  FIND_ALL_TASKS,
  FIND_ALL_TASKS_ASSIGNED_TO,
};
