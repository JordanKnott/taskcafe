import gql from 'graphql-tag';
import TASK_FRAGMENT from './fragments/task';

const FIND_PROJECT_QUERY = gql`
query findProject($projectID: String!) {
  findProject(input: { projectShortID: $projectID }) {
    id
    name
    publicOn
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
    invitedMembers {
      email
      invitedOn
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
