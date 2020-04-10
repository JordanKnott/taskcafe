import React from 'react';
import NormalizeStyles from 'App/NormalizeStyles';
import BaseStyles from 'App/BaseStyles';
import Navbar from 'shared/components/Navbar';
import Sidebar from '.';

export default {
  component: Sidebar,
  title: 'Sidebar',
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
      <Navbar />
      <Sidebar />
    </>
  );
};
