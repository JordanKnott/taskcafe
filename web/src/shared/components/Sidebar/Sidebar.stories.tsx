import React from 'react';
import NormalizeStyles from 'App/NormalizeStyles';
import BaseStyles from 'App/BaseStyles';
import Sidebar from './index';

import Navbar from 'shared/components/Navbar';

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
