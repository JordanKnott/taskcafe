import gql from 'graphql-tag';

const DELETE_TASK_GROUP_TASKS_MUTATION = gql`
  mutation deleteTaskGroupTasks($taskGroupID: UUID!) {
    deleteTaskGroupTasks(input: { taskGroupID: $taskGroupID }) {
      tasks
      taskGroupID
    }
  }
`;
