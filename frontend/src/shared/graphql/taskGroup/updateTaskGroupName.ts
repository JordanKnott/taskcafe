import gql from 'graphql-tag';
import TASK_FRAGMENT from '../fragments/task';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UPDATE_TASK_GROUP_NAME_MUTATION = gql`
mutation updateTaskGroupName($taskGroupID: UUID!, $name: String!) {
  updateTaskGroupName(input:{taskGroupID:$taskGroupID, name:$name}) {
    id
    name
  }
  ${TASK_FRAGMENT}
}
`;
