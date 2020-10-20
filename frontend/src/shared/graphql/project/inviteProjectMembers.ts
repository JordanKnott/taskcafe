import gql from 'graphql-tag';

export const INVITE_PROJECT_MEMBERS_MUTATION = gql`
  mutation inviteProjectMembers($projectID: UUID!, $members: [MemberInvite!]!) {
    inviteProjectMembers(input: { projectID: $projectID, members: $members }) {
      ok
      invitedMembers {
        email
        invitedOn
      }
      members {
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

export default INVITE_PROJECT_MEMBERS_MUTATION;
