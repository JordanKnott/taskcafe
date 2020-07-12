import gql from 'graphql-tag';

const UPDATE_TASK_CHECKLIST_LOCATION_MUTATION = gql`
  mutation updateTaskChecklistLocation($checklistID: UUID!, $position: Float!) {
    updateTaskChecklistLocation(input: { checklistID: $checklistID, position: $position }) {
      checklist {
        id
        position
      }
    }
  }
`;

export default UPDATE_TASK_CHECKLIST_LOCATION_MUTATION;
