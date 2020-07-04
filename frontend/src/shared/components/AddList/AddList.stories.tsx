import React from 'react';
import { action } from '@storybook/addon-actions';
import AddList from '.';

export default {
  component: AddList,
  title: 'AddList',
  parameters: {
    backgrounds: [
      { name: 'gray', value: '#262c49', default: true },
      { name: 'white', value: '#ffffff' },
    ],
  },
};

export const Default = () => {
  return <AddList onSave={action('on save')} />;
};

