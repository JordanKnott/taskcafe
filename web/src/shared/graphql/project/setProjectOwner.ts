import gql from 'graphql-tag';

export const SET_PROJECT_OWNER_MUTATION = gql`
  mutation setProjectOwner($projectID: UUID!, $ownerID: UUID!) {
    setProjectOwner(input: { projectID: $projectID, ownerID: $ownerID }) {
      ok
      newOwner {
        id
        role {
          code
          name
        }
      }
      prevOwner {
        id
        role {
          code
          name
        }
      }
    }
  }
`;

export default SET_PROJECT_OWNER_MUTATION;
