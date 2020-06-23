import gql from 'graphql-tag';

export const GET_TEAM_QUERY = gql`
  query getTeam($teamID: UUID!) {
    findTeam(input: { teamID: $teamID }) {
      id
      createdAt
      name
    }
    projects(input: { teamID: $teamID }) {
      id
      name
      team {
        id
        name
      }
    }
  }
`;

export default GET_TEAM_QUERY;
