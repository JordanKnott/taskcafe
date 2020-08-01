import gql from 'graphql-tag';

export const UPDATE_TEAM_MEMBER_ROLE_MUTATION = gql`
  mutation updateTeamMemberRole($teamID: UUID!, $userID: UUID!, $roleCode: RoleCode!) {
    updateTeamMemberRole(input: { teamID: $teamID, userID: $userID, roleCode: $roleCode }) {
      member {
        id
        role {
          code
          name
        }
      }
      teamID
    }
  }
`;

export default UPDATE_TEAM_MEMBER_ROLE_MUTATION;
