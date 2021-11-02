import gql from 'graphql-tag';
import TASK_FRAGMENT from './fragments/task';

const FIND_PROJECT_QUERY = gql`
  subscription notificationAdded {
    notificationAdded {
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
`;
