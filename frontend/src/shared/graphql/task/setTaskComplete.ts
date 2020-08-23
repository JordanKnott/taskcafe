import gql from 'graphql-tag';
import TASK_FRAGMENT from '../fragments/task';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UPDATE_TASK_GROUP_NAME_MUTATION = gql`
mutation setTaskComplete($taskID: UUID!, $complete: Boolean!) {
  setTaskComplete(input: { taskID: $taskID, complete: $complete }) {
    ...TaskFields
  }
  ${TASK_FRAGMENT}
}
`;
