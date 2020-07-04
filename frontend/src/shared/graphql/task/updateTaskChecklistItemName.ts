import gql from 'graphql-tag';

const UPDATE_TASK_CHECKLIST_ITEM_NAME = gql`
  mutation updateTaskChecklistItemName($taskChecklistItemID: UUID!, $name: String!) {
    updateTaskChecklistItemName(input: { taskChecklistItemID: $taskChecklistItemID, name: $name }) {
      id
      name
    }
  }
`;
