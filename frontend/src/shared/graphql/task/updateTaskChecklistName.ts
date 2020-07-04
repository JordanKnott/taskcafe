import gql from 'graphql-tag';

const UPDATE_TASK_CHECKLIST_NAME_MUTATION = gql`
  mutation updateTaskChecklistName($taskChecklistID: UUID!, $name: String!) {
    updateTaskChecklistName(input: { taskChecklistID: $taskChecklistID, name: $name }) {
      id
      name
      position
      items {
        id
        name
        taskChecklistID
        complete
        position
      }
    }
  }
`;
export default UPDATE_TASK_CHECKLIST_NAME_MUTATION;
