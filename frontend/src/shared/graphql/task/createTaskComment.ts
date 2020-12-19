import gql from 'graphql-tag';

const CREATE_TASK_MUTATION = gql`
  mutation createTaskComment($taskID: UUID!, $message: String!) {
    createTaskComment(input: { taskID: $taskID, message: $message }) {
      taskID
      comment {
        id
        message
        pinned
        createdAt
        updatedAt
        createdBy {
          id
          fullName
          profileIcon {
            initials
            bgColor
            url
          }
        }
      }
    }
  }
`;

export default CREATE_TASK_MUTATION;
