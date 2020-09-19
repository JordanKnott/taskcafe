import gql from 'graphql-tag';

const UPDATE_TASK_CHECKLIST_LOCATION_MUTATION = gql`
  mutation updateTaskChecklistLocation($taskChecklistID: UUID!, $position: Float!) {
    updateTaskChecklistLocation(input: { taskChecklistID: $taskChecklistID, position: $position }) {
      checklist {
        id
        position
      }
    }
  }
`;

export default UPDATE_TASK_CHECKLIST_LOCATION_MUTATION;
