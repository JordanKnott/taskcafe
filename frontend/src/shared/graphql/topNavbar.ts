import gql from 'graphql-tag';

export const TOP_NAVBAR_QUERY = gql`
  query topNavbar {
    notifications {
      createdAt
      read
      id
      entity {
        id
        type
        name
      }
      actor {
        id
        type
        name
      }
      actionType
    }
    me {
      user {
        id
        fullName
        profileIcon {
          initials
          bgColor
          url
        }
      }
      teamRoles {
        teamID
        roleCode
      }
      projectRoles {
        projectID
        roleCode
      }
    }
  }
`;

export default TOP_NAVBAR_QUERY;
