import gql from 'graphql-tag';

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
