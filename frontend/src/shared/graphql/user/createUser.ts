import gql from 'graphql-tag';

export const CREATE_USER_MUTATION = gql`
  mutation createUserAccount(
    $username: String!
    $roleCode: String!
    $email: String!
    $fullName: String!
    $initials: String!
    $password: String!
  ) {
    createUserAccount(
      input: {
        roleCode: $roleCode
        username: $username
        email: $email
        fullName: $fullName
        initials: $initials
        password: $password
      }
    ) {
      id
      email
      fullName
      initials
      username
      bio
      profileIcon {
        url
        initials
        bgColor
      }
      role {
        code
        name
      }
      owned {
        teams {
          id
          name
        }
        projects {
          id
          name
        }
      }
      member {
        teams {
          id
          name
        }
        projects {
          id
          name
        }
      }
    }
  }
`;

export default CREATE_USER_MUTATION;
