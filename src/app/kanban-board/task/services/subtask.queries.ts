import { gql } from 'apollo-angular';

const SUBTASK_EVENT = gql`
  subscription SUBTASK_EVENT {
    subtaskEvent {
      taskEventType
      taskId
      task {
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

const CREATE_SUBTASK = gql`
  mutation CREATE_SUBTASK($taskId: UUID!, $subtaskDTO: TaskDTO!) {
    createSubtask(taskId: $taskId, subtaskDTO: $subtaskDTO) {
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
`;

const UPDATE_SUBTASK = gql`
  mutation UPDATE_SUBTASK($subtaskId: UUID!, $subtaskDTO: TaskDTO!) {
    updateSubtask(subtaskId: $subtaskId, subtaskDTO: $subtaskDTO) {
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
`;

const UPDATE_USER_ASSIGNED_TO_SUBTASK = gql`
  mutation UPDATE_USER_ASSIGNED_TO_SUBTASK(
    $subtaskId: UUID!
    $assignedToId: UUID!
  ) {
    updateUserAssignedToSubtask(
      subtaskId: $subtaskId
      assignedToId: $assignedToId
    ) {
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
`;

const DELETE_SUBTASK = gql`
  mutation DELETE_SUBTASK($subtaskId: UUID!) {
    deleteSubtask(subtaskId: $subtaskId)
  }
`;

const DELETE_ALL_SUBTASKS_BY_TASK_ID = gql`
  mutation DELETE_ALL_SUBTASKS_BY_TASK_ID($taskId: UUID!) {
    deleteAllSubtasksByTaskId(taskId: $taskId)
  }
`;

export {
  SUBTASK_EVENT,
  CREATE_SUBTASK,
  UPDATE_SUBTASK,
  UPDATE_USER_ASSIGNED_TO_SUBTASK,
  DELETE_SUBTASK,
  DELETE_ALL_SUBTASKS_BY_TASK_ID,
};
