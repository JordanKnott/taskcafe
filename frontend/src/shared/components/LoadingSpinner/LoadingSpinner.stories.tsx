import React from 'react';
import NormalizeStyles from 'App/NormalizeStyles';
import BaseStyles from 'App/BaseStyles';
import LoadingSpinner from '.';

export default {
  component: LoadingSpinner,
  title: 'Login',
  parameters: {
    backgrounds: [
      { name: 'white', value: '#ffffff' },
      { name: 'gray', value: '#cdd3e1', default: true },
    ],
  },
};
export const Default = () => {
  return (
    <>
      <NormalizeStyles />
      <BaseStyles />
      <LoadingSpinner />
    </>
  );
};
