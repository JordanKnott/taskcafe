import gql from 'graphql-tag';

export const CREATE_TEAM_MUTATION = gql`
  mutation createTeam($name: String!, $organizationID: UUID!) {
    createTeam(input: { name: $name, organizationID: $organizationID }) {
      id
      createdAt
      name
    }
  }
`;

export default CREATE_TEAM_MUTATION;
