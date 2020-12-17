import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import theme from 'App/ThemeStyles';
import Lists from '.';

export default {
  component: Lists,
  title: 'Lists',
  parameters: {
    backgrounds: [
      { name: 'gray', value: theme.colors.bg.secondary, default: true },
      { name: 'white', value: '#ffffff' },
    ],
  },
};

const initialListsData = {
  columns: {
    'column-1': {
      taskGroupID: 'column-1',
      name: 'General',
      taskIds: ['task-3', 'task-4', 'task-1', 'task-2'],
      position: 1,
      tasks: [],
    },
    'column-2': {
      taskGroupID: 'column-2',
      name: 'Development',
      taskIds: [],
      position: 2,
      tasks: [],
    },
  },
  tasks: {
    'task-1': {
      taskID: 'task-1',
      taskGroup: { taskGroupID: 'column-1' },
      name: 'Create roadmap',
      position: 2,
      labels: [],
    },
    'task-2': {
      taskID: 'task-2',
      taskGroup: { taskGroupID: 'column-1' },
      position: 1,
      name: 'Create authentication',
      labels: [],
    },
    'task-3': {
      taskID: 'task-3',
      taskGroup: { taskGroupID: 'column-1' },
      position: 3,
      name: 'Create login',
      labels: [],
    },
    'task-4': {
      taskID: 'task-4',
      taskGroup: { taskGroupID: 'column-1' },
      position: 4,
      name: 'Create plugins',
      labels: [],
    },
  },
};

export const Default = () => {
  const [listsData, setListsData] = useState(initialListsData);
  const onCardDrop = (droppedTask: Task) => {
    const newState = {
      ...listsData,
      tasks: {
        ...listsData.tasks,
        [droppedTask.id]: droppedTask,
      },
    };
    setListsData(newState);
  };
  const onListDrop = (droppedColumn: any) => {
    const newState = {
      ...listsData,
      columns: {
        ...listsData.columns,
        [droppedColumn.taskGroupID]: droppedColumn,
      },
    };
    setListsData(newState);
  };
  return (
    <Lists
      taskGroups={[]}
      onTaskClick={action('card click')}
      onQuickEditorOpen={action('card composer open')}
      onCreateTask={action('card create')}
      onTaskDrop={onCardDrop}
      onTaskGroupDrop={onListDrop}
      onChangeTaskGroupName={action('change group name')}
      cardLabelVariant="large"
      onCardLabelClick={action('label click')}
      onCreateTaskGroup={action('create list')}
      onExtraMenuOpen={action('extra menu open')}
      onCardMemberClick={action('card member click')}
    />
  );
};
