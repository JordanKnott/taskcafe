import gql from 'graphql-tag';

const UPDATE_TASK_CHECKLIST_ITEM_LOCATION_MUTATION = gql`
  mutation updateTaskChecklistItemLocation($checklistID: UUID!, $checklistItemID: UUID!, $position: Float!) {
    updateTaskChecklistItemLocation(
      input: { checklistID: $checklistID, checklistItemID: $checklistItemID, position: $position }
    ) {
      checklistID
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
