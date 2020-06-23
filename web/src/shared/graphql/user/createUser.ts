import gql from 'graphql-tag';

export const CREATE_USER_MUTATION = gql`
  mutation createUserAccount(
    $username: String!
    $email: String!
    $fullName: String!
    $initials: String!
    $password: String!
  ) {
    createUserAccount(
      input: { username: $username, email: $email, fullName: $fullName, initials: $initials, password: $password }
    ) {
      id
      email
      fullName
      initials
      username
      profileIcon {
        url
        initials
        bgColor
      }
    }
  }
`;

export default CREATE_USER_MUTATION;
