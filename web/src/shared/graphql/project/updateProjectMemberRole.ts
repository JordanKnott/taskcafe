import gql from 'graphql-tag';

export const UPDATE_PROJECT_MEMBER_ROLE_MUTATION = gql`
  mutation updateProjectMemberRole($projectID: UUID!, $userID: UUID!, $roleCode: RoleCode!) {
    updateProjectMemberRole(input: { projectID: $projectID, userID: $userID, roleCode: $roleCode }) {
      ok
      member {
        id
        role {
          code
          name
        }
      }
    }
  }
`;

export default UPDATE_PROJECT_MEMBER_ROLE_MUTATION;
