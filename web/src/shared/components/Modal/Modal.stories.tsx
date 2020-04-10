import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import NormalizeStyles from 'App/NormalizeStyles';
import BaseStyles from 'App/BaseStyles';
import styled from 'styled-components';
import Modal from './index';

export default {
  component: Modal,
  title: 'Modal',
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
      <Modal
        width={1040}
        onClose={action('on close')}
        renderContent={() => {
          return <h1>Hello!</h1>;
        }}
      />
    </>
  );
};
