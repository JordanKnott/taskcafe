import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import User from 'shared/components/icons/solid/User';

import FormTextField from '.';

export default {
  title: 'Components/Form/FormTextField',
  component: FormTextField,
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
} as ComponentMeta<typeof FormTextField>;

const Template: ComponentStory<typeof FormTextField> = (args) => <FormTextField {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  label: 'Username',
  secondaryLabel: {
    label: 'hello',
    onClick: () => {
      // pass
    },
  },
};
