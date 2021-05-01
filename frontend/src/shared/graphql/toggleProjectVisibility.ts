import gql from 'graphql-tag';

export const DELETE_PROJECT_MUTATION = gql`
  mutation toggleProjectVisibility($projectID: UUID!, $isPublic: Boolean!) {
    toggleProjectVisibility(input: { projectID: $projectID, isPublic: $isPublic }) {
      project {
        id
        publicOn
      }
    }
  }
`;

export default DELETE_PROJECT_MUTATION;
