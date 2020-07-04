import gql from 'graphql-tag';

export const DELETE_PROJECT_MUTATION = gql`
  mutation deleteProject($projectID: UUID!) {
    deleteProject(input: { projectID: $projectID }) {
      ok
      project {
        id
      }
    }
  }
`;

export default DELETE_PROJECT_MUTATION;
