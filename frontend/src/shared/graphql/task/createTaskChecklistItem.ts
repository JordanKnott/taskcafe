import gql from 'graphql-tag';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CREATE_TASK_CHECKLIST_ITEM = gql`
  mutation createTaskChecklistItem($taskChecklistID: UUID!, $name: String!, $position: Float!) {
    createTaskChecklistItem(input: { taskChecklistID: $taskChecklistID, name: $name, position: $position }) {
      id
      name
      taskChecklistID
      position
      complete
    }
  }
`;
