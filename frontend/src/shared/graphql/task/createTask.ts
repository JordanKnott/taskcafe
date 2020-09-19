import gql from 'graphql-tag';
import TASK_FRAGMENT from '../fragments/task';

const CREATE_TASK_MUTATION = gql`
  mutation createTask($taskGroupID: UUID!, $name: String!, $position: Float!) {
    createTask(input: { taskGroupID: $taskGroupID, name: $name, position: $position }) {
      ...TaskFields
    }
  }
  ${TASK_FRAGMENT}
`;

export default CREATE_TASK_MUTATION;
