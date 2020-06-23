import gql from 'graphql-tag';

const CREATE_TASK_CHECKLIST_MUTATION = gql`
  mutation createTaskChecklist($taskID: UUID!, $name: String!, $position: Float!) {
    createTaskChecklist(input: { taskID: $taskID, name: $name, position: $position }) {
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

export default CREATE_TASK_CHECKLIST_MUTATION;
