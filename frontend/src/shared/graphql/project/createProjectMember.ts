import gql from 'graphql-tag';

export const CREATE_PROJECT_MEMBER_MUTATION = gql`
  mutation createProjectMember($projectID: UUID!, $userID: UUID!) {
    createProjectMember(input: { projectID: $projectID, userID: $userID }) {
      ok
      member {
        id
        fullName
        profileIcon {
          url
          initials
          bgColor
        }
        username
        role {
          code
          name
        }
      }
    }
  }
`;

export default CREATE_PROJECT_MEMBER_MUTATION;
