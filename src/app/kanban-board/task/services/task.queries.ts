import { gql } from 'apollo-angular';

const GET_TASKS = gql`
    query TASKS_BY_USERNAME {
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

export { GET_TASKS };