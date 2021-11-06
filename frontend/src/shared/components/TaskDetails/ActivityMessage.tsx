import React from 'react';
import styled from 'styled-components';
import { TaskActivityData, ActivityType } from 'shared/generated/graphql';
import dayjs from 'dayjs';

type ActivityMessageProps = {
  type: ActivityType;
  data: Array<TaskActivityData>;
};

function getVariable(data: Array<TaskActivityData>, name: string) {
  const target = data.find((d) => d.name === name);
  return target ? target.value : null;
}

function getVariableBool(data: Array<TaskActivityData>, name: string, defaultValue = false) {
  const target = data.find((d) => d.name === name);
  return target ? target.value === 'true' : defaultValue;
}

function renderDate(timestamp: string | null, hasTime: boolean) {
  if (timestamp) {
    if (hasTime) {
      return dayjs(timestamp).format('MMM D [at] h:mm A');
    }
    return dayjs(timestamp).format('MMM D');
  }
  return null;
}

const ActivityMessage: React.FC<ActivityMessageProps> = ({ type, data }) => {
  let message = '';
  switch (type) {
    case ActivityType.TaskAdded:
      message = `added this task to ${getVariable(data, 'TaskGroup')}`;
      break;
    case ActivityType.TaskMoved:
      message = `moved this task from ${getVariable(data, 'PrevTaskGroup')} to ${getVariable(data, 'CurTaskGroup')}`;
      break;
    case ActivityType.TaskDueDateAdded:
      message = `set this task to be due ${renderDate(
        getVariable(data, 'DueDate'),
        getVariableBool(data, 'HasTime', true),
      )}`;
      break;
    case ActivityType.TaskDueDateRemoved:
      message = `removed the due date from this task`;
      break;
    case ActivityType.TaskDueDateChanged:
      message = `changed the due date of this task to ${renderDate(
        getVariable(data, 'CurDueDate'),
        getVariableBool(data, 'HasTime', true),
      )}`;
      break;
    case ActivityType.TaskMarkedComplete:
      message = `marked this task complete`;
      break;
    case ActivityType.TaskMarkedIncomplete:
      message = `marked this task incomplete`;
      break;
    default:
      message = '<unknown type>';
  }
  return <>{message}</>;
};

export default ActivityMessage;
