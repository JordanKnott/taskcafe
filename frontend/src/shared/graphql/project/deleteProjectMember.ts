import gql from 'graphql-tag';

export const DELETE_PROJECT_MEMBER_MUTATION = gql`
  mutation deleteProjectMember($projectID: UUID!, $userID: UUID!) {
    deleteProjectMember(input: { projectID: $projectID, userID: $userID }) {
      ok
      member {
        id
      }
      projectID
    }
  }
`;

export default DELETE_PROJECT_MEMBER_MUTATION;
