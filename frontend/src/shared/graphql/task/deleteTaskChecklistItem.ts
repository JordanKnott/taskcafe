import gql from 'graphql-tag';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DELETE_TASK_CHECKLIST_ITEM = gql`
  mutation deleteTaskChecklistItem($taskChecklistItemID: UUID!) {
    deleteTaskChecklistItem(input: { taskChecklistItemID: $taskChecklistItemID }) {
      ok
      taskChecklistItem {
        id
        taskChecklistID
      }
    }
  }
`;
