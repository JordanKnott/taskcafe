import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import Lists from '.';

export default {
  component: Lists,
  title: 'Lists',
  parameters: {
    backgrounds: [
      { name: 'white', value: '#ffffff', default: true },
      { name: 'gray', value: '#f8f8f8' },
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
      taskGroupID: 'column-1',
      name: 'Create roadmap',
      position: 2,
      labels: [],
    },
    'task-2': {
      taskID: 'task-2',
      taskGroupID: 'column-1',
      position: 1,
      name: 'Create authentication',
      labels: [],
    },
    'task-3': {
      taskID: 'task-3',
      taskGroupID: 'column-1',
      position: 3,
      name: 'Create login',
      labels: [],
    },
    'task-4': {
      taskID: 'task-4',
      taskGroupID: 'column-1',
      position: 4,
      name: 'Create plugins',
      labels: [],
    },
  },
};

export const Default = () => {
  const [listsData, setListsData] = useState(initialListsData);
  const onCardDrop = (droppedTask: any) => {
    console.log(droppedTask);
    const newState = {
      ...listsData,
      tasks: {
        ...listsData.tasks,
        [droppedTask.id]: droppedTask,
      },
    };
    console.log(newState);
    setListsData(newState);
  };
  const onListDrop = (droppedColumn: any) => {
    const newState = {
      ...listsData,
      columns: {
        ...listsData.columns,
        [droppedColumn.id]: droppedColumn,
      },
    };
    setListsData(newState);
  };
  return (
    <Lists
      {...listsData}
      onQuickEditorOpen={action('card composer open')}
      onCardDrop={onCardDrop}
      onListDrop={onListDrop}
      onCardCreate={action('card create')}
    />
  );
};

const createColumn = (id: any, name: any, position: any) => {
  return {
    taskGroupID: id,
    name,
    position,
    tasks: [],
  };
};

const initialListsDataLarge = {
  columns: {
    'column-1': createColumn('column-1', 'General', 1),
    'column-2': createColumn('column-2', 'General', 2),
    'column-3': createColumn('column-3', 'General', 3),
    'column-4': createColumn('column-4', 'General', 4),
    'column-5': createColumn('column-5', 'General', 5),
    'column-6': createColumn('column-6', 'General', 6),
    'column-7': createColumn('column-7', 'General', 7),
    'column-8': createColumn('column-8', 'General', 8),
    'column-9': createColumn('column-9', 'General', 9),
  },
  tasks: {
    'task-1': {
      taskID: 'task-1',
      taskGroupID: 'column-1',
      name: 'Create roadmap',
      position: 2,
      labels: [],
    },
    'task-2': {
      taskID: 'task-2',
      taskGroupID: 'column-1',
      position: 1,
      name: 'Create authentication',
      labels: [],
    },
    'task-3': {
      taskID: 'task-3',
      taskGroupID: 'column-1',
      position: 3,
      name: 'Create login',
      labels: [],
    },
    'task-4': {
      taskID: 'task-4',
      taskGroupID: 'column-1',
      position: 4,
      name: 'Create plugins',
      labels: [],
    },
  },
};

export const ListsWithManyList = () => {
  const [listsData, setListsData] = useState(initialListsDataLarge);
  const onCardDrop = (droppedTask: any) => {
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
        [droppedColumn.id]: droppedColumn,
      },
    };
    setListsData(newState);
  };
  return (
    <Lists
      {...listsData}
      onQuickEditorOpen={action('card composer open')}
      onCardCreate={action('card create')}
      onCardDrop={onCardDrop}
      onListDrop={onListDrop}
    />
  );
};
