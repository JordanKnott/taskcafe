import gql from 'graphql-tag';

const CREATE_TASK_MUTATION = gql`
  mutation notificationMarkAllRead {
    notificationMarkAllRead {
      success
    }
  }
`;

export default CREATE_TASK_MUTATION;
