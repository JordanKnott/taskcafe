import gql from 'graphql-tag';

export const INVITE_PROJECT_MEMBER_MUTATION = gql`
  mutation inviteProjectMember($projectID: UUID!, $userID: UUID, $email: String) {
    inviteProjectMember(input: { projectID: $projectID, userID: $userID, email: $email }) {
      ok
      member {
        id
        fullName
        profileIcon {
          url
          initials
          bgColor
        }
        username
        role {
          code
          name
        }
      }
    }
  }
`;

export default INVITE_PROJECT_MEMBER_MUTATION;
