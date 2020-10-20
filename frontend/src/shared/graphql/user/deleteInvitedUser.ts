import gql from 'graphql-tag';

export const DELETE_INVITED_USER_MUTATION = gql`
  mutation deleteInvitedUserAccount($invitedUserID: UUID!) {
    deleteInvitedUserAccount(input: { invitedUserID: $invitedUserID }) {
      invitedUser {
        id
      }
    }
  }
`;

export default DELETE_INVITED_USER_MUTATION;
