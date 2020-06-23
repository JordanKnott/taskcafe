import React, { useRef } from 'react';
import Admin from '.';
import { theme } from 'App/ThemeStyles';
import NormalizeStyles from 'App/NormalizeStyles';
import BaseStyles from 'App/BaseStyles';
import { ThemeProvider } from 'styled-components';
import { action } from '@storybook/addon-actions';

export default {
  component: Admin,
  title: 'Admin',
  parameters: {
    backgrounds: [
      { name: 'gray', value: '#f8f8f8', default: true },
      { name: 'white', value: '#ffffff' },
    ],
  },
};

export const Default = () => {
  return (
    <>
      <NormalizeStyles />
      <BaseStyles />
      <ThemeProvider theme={theme}>
        <Admin
          onInviteUser={action('invite user')}
          initialTab={1}
          users={[
            {
              id: '1',
              username: 'jordanthedev',
              email: 'jordan@jordanthedev.com',
              role: 'Admin',
              fullName: 'Jordan Knott',
              profileIcon: {
                bgColor: '#fff',
                initials: 'JK',
                url: null,
              },
            },
          ]}
          onAddUser={action('add user')}
        />
      </ThemeProvider>
    </>
  );
};
