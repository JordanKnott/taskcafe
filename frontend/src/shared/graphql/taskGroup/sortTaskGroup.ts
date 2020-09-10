import gql from 'graphql-tag';

const SORT_TASK_GROUP_MUTATION = gql`
  mutation sortTaskGroup($tasks: [TaskPositionUpdate!]!, $taskGroupID: UUID!) {
    sortTaskGroup(input: { taskGroupID: $taskGroupID, tasks: $tasks }) {
      taskGroupID
      tasks {
        id
        position
      }
    }
  }
`;
