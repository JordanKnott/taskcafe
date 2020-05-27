import React, { useRef } from 'react';
import { action } from '@storybook/addon-actions';
import DueDateManager from '.';

export default {
  component: DueDateManager,
  title: 'DueDateManager',
  parameters: {
    backgrounds: [
      { name: 'gray', value: '#f8f8f8', default: true },
      { name: 'white', value: '#ffffff' },
    ],
  },
};

export const Default = () => {
  return (
    <DueDateManager
      task={{
        taskID: '1',
        taskGroup: { name: 'General', taskGroupID: '1' },
        name: 'Hello, world',
        position: 1,
        labels: [
          {
            labelId: 'soft-skills',
            labelColor: { id: '1', colorHex: '#fff', name: 'white', position: 1 },
            active: true,
            name: 'Soft Skills',
          },
        ],
        description: 'hello!',
        members: [
          { userID: '1', profileIcon: { url: null, initials: null, bgColor: null }, displayName: 'Jordan Knott' },
        ],
      }}
      onCancel={action('cancel')}
      onDueDateChange={action('due date change')}
    />
  );
};
