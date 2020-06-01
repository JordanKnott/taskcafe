import React, { useState, useRef, createRef } from 'react';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';
import NormalizeStyles from 'App/NormalizeStyles';
import BaseStyles from 'App/BaseStyles';

import NewProject from '.';

export default {
  component: NewProject,
  title: 'NewProject',
  parameters: {
    backgrounds: [
      { name: 'white', value: '#ffffff', default: true },
      { name: 'gray', value: '#f8f8f8' },
    ],
  },
};

export const Default = () => {
  return (
    <>
      <NormalizeStyles />
      <BaseStyles />
      <NewProject
        onCreateProject={action('create project')}
        teams={[{ name: 'General', id: 'general', createdAt: '' }]}
        onClose={() => {}}
      />
    </>
  );
};
