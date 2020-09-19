import gql from 'graphql-tag';

const UPDATE_TASK_CHECKLIST_ITEM_LOCATION_MUTATION = gql`
  mutation updateTaskChecklistItemLocation($taskChecklistID: UUID!, $taskChecklistItemID: UUID!, $position: Float!) {
    updateTaskChecklistItemLocation(
      input: { taskChecklistID: $taskChecklistID, taskChecklistItemID: $taskChecklistItemID, position: $position }
    ) {
      taskChecklistID
      prevChecklistID
      checklistItem {
        id
        taskChecklistID
        position
      }
    }
  }
`;

export default UPDATE_TASK_CHECKLIST_ITEM_LOCATION_MUTATION;
