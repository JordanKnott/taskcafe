import React, { createRef, useState } from 'react';
import { action } from '@storybook/addon-actions';
import NormalizeStyles from 'App/NormalizeStyles';
import BaseStyles from 'App/BaseStyles';
import Settings from '.';

export default {
  component: Settings,
  title: 'Settings',
  parameters: {
    backgrounds: [
      { name: 'white', value: '#ffffff', default: true },
      { name: 'gray', value: '#f8f8f8' },
    ],
  },
};
const profile = {
  id: '1',
  fullName: 'Jordan Knott',
  username: 'jordanthedev',
  profileIcon: { url: '/uploads/headshot.png', bgColor: '#000', initials: 'JK' },
};
export const Default = () => {
  return (
    <>
      <NormalizeStyles />
      <BaseStyles />
      <Settings
        profile={profile}
        onChangeUserInfo={action('change user info')}
        onResetPassword={action('reset password')}
        onProfileAvatarRemove={action('remove')}
        onProfileAvatarChange={action('profile avatar change')}
      />
    </>
  );
};
