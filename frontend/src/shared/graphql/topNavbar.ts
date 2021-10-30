import gql from 'graphql-tag';

export const TOP_NAVBAR_QUERY = gql`
  query topNavbar {
    notifications {
      id
      read
      readAt
      notification {
        id
        actionType
        causedBy {
          username
          fullname
          id
        }
        createdAt
      }
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
