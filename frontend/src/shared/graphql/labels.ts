import gql from 'graphql-tag';
import TASK_FRAGMENT from './fragments/task';

const FIND_PROJECT_QUERY = gql`
  query labels($projectID: UUID!) {
    findProject(input: { projectID: $projectID }) {
      labels {
        id
        createdDate
        name
        labelColor {
          id
          name
          colorHex
          position
        }
      }
    }
    labelColors {
      id
      position
      colorHex
      name
    }
  }
`;
