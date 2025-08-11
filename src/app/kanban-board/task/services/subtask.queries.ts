import { gql } from 'apollo-angular';

const DELETE_SUBTASK = gql`
  mutation DELETE_SUBTASK($subtaskId: UUID!) {
    deleteSubtask(subtaskId: $subtaskId)
  }
`;

export { DELETE_SUBTASK };
