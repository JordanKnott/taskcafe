import React, { useState } from 'react';
import NormalizeStyles from 'App/NormalizeStyles';
import BaseStyles from 'App/BaseStyles';
import { action } from '@storybook/addon-actions';
import DropdownMenu from 'shared/components/DropdownMenu';
import TopNavbar from '.';

export default {
  component: TopNavbar,
  title: 'TopNavbar',

  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  parameters: {
    backgrounds: [
      { name: 'white', value: '#ffffff' },
      { name: 'gray', value: '#f8f8f8' },
      { name: 'darkBlue', value: '#262c49', default: true },
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
