import gql from 'graphql-tag';
import TASK_FRAGMENT from '../fragments/task';

const DUPLICATE_TASK_GROUP_MUTATION = gql`
mutation duplicateTaskGroup($taskGroupID: UUID!, $name: String!, $position: Float!, $projectID: UUID!) {
  duplicateTaskGroup(
  input: {
    projectID: $projectID
    taskGroupID: $taskGroupID
    name: $name
    position: $position
  }
  ) {
    taskGroup {
      id
      name
      position
      tasks {
        ...TaskFields
      }
    }
  }

  ${TASK_FRAGMENT}
}
`;
