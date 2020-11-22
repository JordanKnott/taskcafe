import React from 'react';
import { ThemeProvider } from 'styled-components';
import { action } from '@storybook/addon-actions';
import theme from 'App/ThemeStyles';
import NormalizeStyles from 'App/NormalizeStyles';
import BaseStyles from 'App/BaseStyles';
import Admin from '.';

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
          canInviteUser
          initialTab={1}
          onUpdateUserPassword={action('update user password')}
          onDeleteUser={action('delete user')}
          users={[
            {
              id: '1',
              username: 'jordanthedev',
              email: 'jordan@jordanthedev.com',
              role: { code: 'admin', name: 'Admin' },
              fullName: 'Jordan Knott',
              profileIcon: {
                bgColor: '#fff',
                initials: 'JK',
                url: null,
              },
              owned: {
                teams: [{ id: '1', name: 'Team' }],
                projects: [{ id: '2', name: 'Project' }],
              },
              member: {
                teams: [],
                projects: [],
              },
            },
          ]}
          invitedUsers={[]}
          onAddUser={action('add user')}
          onDeleteInvitedUser={action('delete invited user')}
        />
      </ThemeProvider>
    </>
  );
};
