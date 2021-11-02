import gql from 'graphql-tag';

export const TOP_NAVBAR_QUERY = gql`
  query notifications($limit: Int!, $cursor: String, $filter: NotificationFilter!) {
    notified(input: { limit: $limit, cursor: $cursor, filter: $filter }) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      notified {
        id
        read
        readAt
        notification {
          id
          actionType
          data {
            key
            value
          }
          causedBy {
            username
            fullname
            id
          }
          createdAt
        }
      }
    }
  }
`;

export default TOP_NAVBAR_QUERY;
