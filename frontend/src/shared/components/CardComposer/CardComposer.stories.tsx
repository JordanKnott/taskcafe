import React from 'react';
import { action } from '@storybook/addon-actions';
import CardComposer from '.';

export default {
  component: CardComposer,
  title: 'CardComposer',
  parameters: {
    backgrounds: [
      { name: 'gray', value: '#f8f8f8', default: true },
      { name: 'white', value: '#ffffff' },
    ],
  },
};

export const Default = () => {
  return <CardComposer isOpen onClose={action('on close')} onCreateCard={action('on create card')} />;
};
