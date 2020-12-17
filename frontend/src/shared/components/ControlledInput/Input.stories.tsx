import React from 'react';
import BaseStyles from 'App/BaseStyles';
import NormalizeStyles from 'App/NormalizeStyles';
import theme from 'App/ThemeStyles';
import styled, { ThemeProvider } from 'styled-components';
import { User } from 'shared/icons';

import Input from '.';

export default {
  component: Input,
  title: 'Input',
  parameters: {
    backgrounds: [
      { name: 'white', value: '#ffffff', default: true },
      { name: 'gray', value: '#f8f8f8' },
    ],
  },
};

const Wrapper = styled.div`
  background: ${props => props.theme.colors.bg.primary};
  padding: 45px;
  margin: 25px;
  display: flex;
  flex-direction: column;
`;

export const Default = () => {
  return (
    <>
      <NormalizeStyles />
      <BaseStyles />
      <ThemeProvider theme={theme}>
        <Wrapper>
          <Input label="Label placeholder" />
          <Input width="100%" placeholder="Placeholder" />
          <Input icon={<User width={20} height={20} />} width="100%" placeholder="Placeholder" />
        </Wrapper>
      </ThemeProvider>
    </>
  );
};
