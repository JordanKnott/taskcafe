import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import User from 'shared/components/icons/solid/User';

import FormButton from '.';

export default {
  title: 'Components/Form/FormButton',
  component: FormButton,
  argTypes: {
    onClick: { action: 'clicked' },
    icon: {
      options: ['None', 'User'],
      mapping: {
        None: undefined,
        User: <User />,
      },
    },
  },
} as ComponentMeta<typeof FormButton>;

const Template: ComponentStory<typeof FormButton> = ({ children, ...args }) => (
  <FormButton {...args}>{children}</FormButton>
);

export const Primary = Template.bind({});

Primary.args = {
  variant: 'filled',
  backgroundColor: 'primary',
  textColor: 'secondary',
  children: 'Login',
};
