import React from 'react';
import { action } from '@storybook/addon-actions';
import MemberManager from '.';

export default {
  component: MemberManager,
  title: 'MemberManager',
  parameters: {
    backgrounds: [
      { name: 'white', value: '#ffffff', default: true },
      { name: 'gray', value: '#f8f8f8' },
    ],
  },
};

export const Default = () => {
  return <MemberManager availableMembers={[]} activeMembers={[]} onMemberChange={action('member change')} />;
};
