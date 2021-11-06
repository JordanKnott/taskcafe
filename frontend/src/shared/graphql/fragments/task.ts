import gql from 'graphql-tag';

const TASK_FRAGMENT = gql`
  fragment TaskFields on Task {
    id
    shortId
    name
    description
    dueDate {
      at
    }
    hasTime
    complete
    watched
    completedAt
    position
    badges {
      checklist {
        complete
        total
      }
      comments {
        unread
        total
      }
    }
    taskGroup {
      id
      name
      position
    }
    labels {
      id
      assignedDate
      projectLabel {
        id
        name
        createdDate
        labelColor {
          id
          colorHex
          position
          name
        }
      }
    }
    assigned {
      id
      fullName
      profileIcon {
        url
        initials
        bgColor
      }
    }
  }
`;

export default TASK_FRAGMENT;
