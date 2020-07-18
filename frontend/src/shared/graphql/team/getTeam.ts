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
        profileIcon {
          url
          initials
          bgColor
        }
        owned {
          teams {
            id
            name
          }
          projects {
            id
            name
          }
        }
        member {
          teams {
            id
            name
          }
          projects {
            id
            name
          }
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
      owned {
        teams {
          id
          name
        }
        projects {
          id
          name
        }
      }
      member {
        teams {
          id
          name
        }
        projects {
          id
          name
        }
      }
    }
  }
`;

export default GET_TEAM_QUERY;
