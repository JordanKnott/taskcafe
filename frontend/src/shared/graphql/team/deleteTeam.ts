import gql from 'graphql-tag';

export const DELETE_TEAM_MUTATION = gql`
  mutation deleteTeam($teamID: UUID!) {
    deleteTeam(input: { teamID: $teamID }) {
      ok
      team {
        id
      }
    }
  }
`;

export default DELETE_TEAM_MUTATION;
