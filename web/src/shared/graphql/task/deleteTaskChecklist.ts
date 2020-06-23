import gql from 'graphql-tag';

const DELETE_TASK_CHECKLIST_MUTATION = gql`
  mutation deleteTaskChecklist($taskChecklistID: UUID!) {
    deleteTaskChecklist(input: { taskChecklistID: $taskChecklistID }) {
      ok
      taskChecklist {
        id
      }
    }
  }
`;

export default DELETE_TASK_CHECKLIST_MUTATION;
