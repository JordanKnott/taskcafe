import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import LoginPage from './LoginPage';

export default {
  title: 'Pages/LoginPage',
  component: LoginPage,
  argTypes: {
    onLogin: {
      action: 'on login',
    },
    onRegister: {
      options: ['None', 'Standard'],
      defaultValue: 'Standard',
      mapping: {
        Standard: () => action('on register'),
        None: undefined,
      },
    },
  },
} as ComponentMeta<typeof LoginPage>;

const Template: ComponentStory<typeof LoginPage> = ({ children, ...args }) => <LoginPage {...args} />;

export const Primary = Template.bind({});

Primary.args = { isLoading: true };
