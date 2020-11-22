import gql from 'graphql-tag';

export const DELETE_PROJECT_INVITED_MEMBER_MUTATION = gql`
  mutation deleteInvitedProjectMember($projectID: UUID!, $email: String!) {
    deleteInvitedProjectMember(input: { projectID: $projectID, email: $email }) {
      invitedMember {
        email
      }
    }
  }
`;

export default DELETE_PROJECT_INVITED_MEMBER_MUTATION;
