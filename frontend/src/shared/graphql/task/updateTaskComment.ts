import gql from 'graphql-tag';

const CREATE_TASK_MUTATION = gql`
  mutation updateTaskComment($commentID: UUID!, $message: String!) {
    updateTaskComment(input: { commentID: $commentID, message: $message }) {
      comment {
        id
        updatedAt
        message
      }
    }
  }
`;

export default CREATE_TASK_MUTATION;
