import gql from 'graphql-tag';

export const UPDATE_USER_PASSWORD_MUTATION = gql`
  mutation updateUserPassword($userID: UUID!, $password: String!) {
    updateUserPassword(input: { userID: $userID, password: $password }) {
      ok
    }
  }
`;

export default UPDATE_USER_PASSWORD_MUTATION;
