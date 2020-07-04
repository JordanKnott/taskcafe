import gql from 'graphql-tag';

export const CREATE_TEAM_MEMBER_MUTATION = gql`
  mutation createTeamMember($userID: UUID!, $teamID: UUID!) {
    createTeamMember(input: { userID: $userID, teamID: $teamID }) {
      team {
        id
      }
      teamMember {
        id
        username
        fullName
        role {
          code
          name
        }
        profileIcon {
          url
          initials
          bgColor
        }
      }
    }
  }
`;

export default CREATE_TEAM_MEMBER_MUTATION;
