import React from 'react';
import { action } from '@storybook/addon-actions';
import ListActions from '.';

export default {
  component: ListActions,
  title: 'ListActions',
  parameters: {
    backgrounds: [
      { name: 'white', value: '#ffffff', default: true },
      { name: 'gray', value: '#f8f8f8' },
    ],
  },
};

export const Default = () => {
  return <ListActions taskGroupID="1" onArchiveTaskGroup={action('on archive task group')} />;
};
