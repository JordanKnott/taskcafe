import gql from 'graphql-tag';

const SET_TASK_CHECKLIST_ITEM_COMPLETE = gql`
  mutation setTaskChecklistItemComplete($taskChecklistItemID: UUID!, $complete: Boolean!) {
    setTaskChecklistItemComplete(input: { taskChecklistItemID: $taskChecklistItemID, complete: $complete }) {
      id
      complete
    }
  }
`;
