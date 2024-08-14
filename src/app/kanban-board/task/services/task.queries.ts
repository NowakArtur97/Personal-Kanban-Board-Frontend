import { gql } from 'apollo-angular';

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

export { FIND_ALL_USER_TASKS };