import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import User from 'shared/components/icons/solid/User';

import FormPasswordField from '.';

export default {
  title: 'Components/Form/FormPasswordField',
  component: FormPasswordField,
  argTypes: {
    onChange: { action: 'on change' },
    onBlur: { action: 'on blur' },
    icon: {
      options: ['None', 'User'],
      mapping: {
        User: <User />,
        None: undefined,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof FormPasswordField>;

const Template: ComponentStory<typeof FormPasswordField> = (args) => <FormPasswordField {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  label: 'Username',
};
