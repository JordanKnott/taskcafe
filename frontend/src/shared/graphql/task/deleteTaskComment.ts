import gql from 'graphql-tag';

const CREATE_TASK_MUTATION = gql`
  mutation deleteTaskComment($commentID: UUID!) {
    deleteTaskComment(input: { commentID: $commentID }) {
      commentID
    }
  }
`;

export default CREATE_TASK_MUTATION;
