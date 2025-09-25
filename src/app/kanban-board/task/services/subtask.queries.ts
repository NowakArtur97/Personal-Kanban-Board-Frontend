import { gql } from 'apollo-angular';

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

const DELETE_SUBTASK = gql`
  mutation DELETE_SUBTASK($subtaskId: UUID!) {
    deleteSubtask(subtaskId: $subtaskId)
  }
`;

export { CREATE_SUBTASK, UPDATE_SUBTASK, DELETE_SUBTASK };
