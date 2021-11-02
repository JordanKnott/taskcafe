import gql from 'graphql-tag';

const CREATE_TASK_MUTATION = gql`
  mutation notificationToggleRead($notifiedID: UUID!) {
    notificationToggleRead(input: { notifiedID: $notifiedID }) {
      id
      read
      readAt
    }
  }
`;

export default CREATE_TASK_MUTATION;
