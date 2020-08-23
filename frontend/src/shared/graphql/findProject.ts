import gql from 'graphql-tag';
import TASK_FRAGMENT from './fragments/task';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FIND_PROJECT_QUERY = gql`
query findProject($projectID: UUID!) {
  findProject(input: { projectID: $projectID }) {
    name
    team {
      id
    }
    members {
      id
      fullName
      username
      role {
        code
        name
      }
      profileIcon {
        url
        initials
        bgColor
      }
    }
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
    taskGroups {
      id
      name
      position
      tasks {
        ...TaskFields
      }
    }
  }
  labelColors {
    id
    position
    colorHex
    name
  }
  users {
    id
    email
    fullName
    username
    role {
      code
      name
    }
    profileIcon {
      url
      initials
      bgColor
    }
    owned {
      teams {
        id
        name
      }
      projects {
        id
        name
      }
    }
    member {
      teams {
        id
        name
      }
      projects {
        id
        name
      }
    }
  }
  ${TASK_FRAGMENT}
}
`;
