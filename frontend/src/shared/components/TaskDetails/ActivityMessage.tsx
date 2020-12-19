import React from 'react';
import styled from 'styled-components';
import { TaskActivityData, ActivityType } from 'shared/generated/graphql';

type ActivityMessageProps = {
  type: ActivityType;
  data: Array<TaskActivityData>;
};

function getVariable(data: Array<TaskActivityData>, name: string) {
  const target = data.find(d => d.name === name);
  return target ? target.value : null;
}

const ActivityMessage: React.FC<ActivityMessageProps> = ({ type, data }) => {
  switch (type) {
    case ActivityType.TaskAdded:
      return <>`added this task to ${getVariable(data, 'TaskGroup')}`</>;
  }
  return <h1>hello</h1>;
};

export default ActivityMessage;
