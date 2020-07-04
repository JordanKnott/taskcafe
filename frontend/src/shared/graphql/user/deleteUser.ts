import gql from 'graphql-tag';

export const DELETE_USER_MUTATION = gql`
  mutation deleteUserAccount($userID: UUID!) {
    deleteUserAccount(input: { userID: $userID }) {
      ok
      userAccount {
        id
      }
    }
  }
`;

export default DELETE_USER_MUTATION;
