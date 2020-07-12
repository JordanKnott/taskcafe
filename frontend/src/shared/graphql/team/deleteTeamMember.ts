import gql from 'graphql-tag';

export const DELETE_TEAM_MEMBER_MUTATION = gql`
  mutation deleteTeamMember($teamID: UUID!, $userID: UUID!, $newOwnerID: UUID) {
    deleteTeamMember(input: { teamID: $teamID, userID: $userID, newOwnerID: $newOwnerID }) {
      teamID
      userID
    }
  }
`;

export default DELETE_TEAM_MEMBER_MUTATION;
