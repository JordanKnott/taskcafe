import React, { useState } from 'react';
import NormalizeStyles from 'App/NormalizeStyles';
import BaseStyles from 'App/BaseStyles';
import { action } from '@storybook/addon-actions';
import TopNavbar from '.';
import theme from '../../../App/ThemeStyles';

export default {
  component: TopNavbar,
  title: 'TopNavbar',

  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  parameters: {
    backgrounds: [
      { name: 'white', value: '#ffffff' },
      { name: 'gray', value: '#f8f8f8' },
      { name: 'darkBlue', value: theme.colors.bg.secondary, default: true },
    ],
  },
};

export const Default = () => {
  return (
    <>
      <NormalizeStyles />
      <BaseStyles />
      <TopNavbar
        onOpenProjectFinder={action('finder')}
        name="Projects"
        user={{
          id: '1',
          fullName: 'Jordan Knott',
          profileIcon: {
            url: null,
            initials: 'JK',
            bgColor: '#000',
          },
        }}
        onChangeRole={action('change role')}
        onNotificationClick={action('notifications click')}
        onOpenSettings={action('open settings')}
        onDashboardClick={action('open dashboard')}
        onRemoveFromBoard={action('remove project')}
        onProfileClick={action('profile click')}
      />
    </>
  );
};
