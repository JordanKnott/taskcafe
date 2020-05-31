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
        id: '1',
        taskGroup: { name: 'General', id: '1', position: 1 },
        name: 'Hello, world',
        position: 1,
        labels: [
          {
            id: 'soft-skills',
            assignedDate: new Date().toString(),
            projectLabel: {
              createdDate: new Date().toString(),
              id: 'label-soft-skills',
              name: 'Soft Skills',
              labelColor: {
                id: '1',
                name: 'white',
                colorHex: '#fff',
                position: 1,
              },
            },
          },
        ],
        description: 'hello!',
        assigned: [
          {
            id: '1',
            profileIcon: { url: null, initials: null, bgColor: null },
            firstName: 'Jordan',
            lastName: 'Knott',
          },
        ],
      }}
      onCancel={action('cancel')}
      onDueDateChange={action('due date change')}
    />
  );
};
