import gql from 'graphql-tag';

const CREATE_TASK_MUTATION = gql`
  mutation toggleTaskWatch($taskID: UUID!) {
    toggleTaskWatch(input: { taskID: $taskID }) {
      id
      watched
    }
  }
`;

export default CREATE_TASK_MUTATION;
