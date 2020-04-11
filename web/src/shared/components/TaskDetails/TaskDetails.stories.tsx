import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import NormalizeStyles from 'App/NormalizeStyles';
import BaseStyles from 'App/BaseStyles';
import Modal from 'shared/components/Modal';
import TaskDetails from '.';

export default {
  component: TaskDetails,
  title: 'TaskDetails',
  parameters: {
    backgrounds: [
      { name: 'white', value: '#ffffff' },
      { name: 'gray', value: '#cdd3e1', default: true },
    ],
  },
};

export const Default = () => {
  const [description, setDescription] = useState('');
  return (
    <>
      <NormalizeStyles />
      <BaseStyles />
      <Modal
        width={1040}
        onClose={action('on close')}
        renderContent={() => {
          return (
            <TaskDetails
              task={{
                taskID: '1',
                taskGroup: { taskGroupID: '1' },
                name: 'Hello, world',
                position: 1,
                labels: [],
                description,
              }}
              onTaskDescriptionChange={(_task, desc) => setDescription(desc)}
              onDeleteTask={action('delete task')}
              onCloseModal={action('close modal')}
            />
          );
        }}
      />
    </>
  );
};
