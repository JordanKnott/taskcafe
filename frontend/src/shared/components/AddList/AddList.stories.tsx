import React from 'react';
import { action } from '@storybook/addon-actions';
import theme from 'App/ThemeStyles';
import AddList from '.';

export default {
  component: AddList,
  title: 'AddList',
  parameters: {
    backgrounds: [
      { name: 'gray', value: theme.colors.bg.secondary, default: true },
      { name: 'white', value: '#ffffff' },
    ],
  },
};

export const Default = () => {
  return <AddList onSave={action('on save')} />;
};
