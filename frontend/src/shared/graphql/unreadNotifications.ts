import gql from 'graphql-tag';

export const TOP_NAVBAR_QUERY = gql`
  query hasUnreadNotifications {
    hasUnreadNotifications {
      unread
    }
  }
`;

export default TOP_NAVBAR_QUERY;
