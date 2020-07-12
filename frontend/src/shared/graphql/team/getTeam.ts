import gql from 'graphql-tag';

export const GET_TEAM_QUERY = gql`
  query getTeam($teamID: UUID!) {
    findTeam(input: { teamID: $teamID }) {
      id
      createdAt
      name
      members {
        id
        fullName
        username
        role {
          code
          name
        }
        owned {
          projects
          teams
        }
        profileIcon {
          url
          initials
          bgColor
        }
      }
    }
    projects(input: { teamID: $teamID }) {
      id
      name
      team {
        id
        name
      }
    }
    users {
      id
      email
      fullName
      username
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
`;

export default GET_TEAM_QUERY;
