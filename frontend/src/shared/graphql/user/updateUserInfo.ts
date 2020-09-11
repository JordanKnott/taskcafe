import gql from 'graphql-tag';

export const UPDATE_USER_INFO_MUTATION = gql`
  mutation updateUserInfo($name: String!, $initials: String!, $email: String!, $bio: String!) {
    updateUserInfo(input: { name: $name, initials: $initials, email: $email, bio: $bio }) {
      user {
        id
        email
        fullName
        bio
        profileIcon {
          initials
        }
      }
    }
  }
`;

export default UPDATE_USER_INFO_MUTATION;
