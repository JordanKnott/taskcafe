import gql from 'graphql-tag';

export const UPDATE_USER_ROLE_MUTATION = gql`
  mutation updateUserRole($userID: UUID!, $roleCode: RoleCode!) {
    updateUserRole(input: { userID: $userID, roleCode: $roleCode }) {
      user {
        id
        role {
          code
          name
        }
      }
    }
  }
`;

export default UPDATE_USER_ROLE_MUTATION;
