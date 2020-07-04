import React from 'react';
import { action } from '@storybook/addon-actions';
import NormalizeStyles from 'App/NormalizeStyles';
import BaseStyles from 'App/BaseStyles';
import styled from 'styled-components';
import Login from '.';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default {
  component: Login,
  title: 'Login',
  parameters: {
    backgrounds: [
      { name: 'white', value: '#ffffff' },
      { name: 'gray', value: '#cdd3e1', default: true },
    ],
  },
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

const LoginWrapper = styled.div`
  width: 60%;
`;

export const Default = () => {
  return (
    <>
      <NormalizeStyles />
      <BaseStyles />
      <Container>
        <LoginWrapper>
          <Login onSubmit={action('on submit')} />
        </LoginWrapper>
      </Container>
    </>
  );
};

export const WithSubmission = () => {
  const onSubmit = async (data: LoginFormData, setComplete: (val: boolean) => void, setError: any) => {
    await sleep(2000);
    if (data.username !== 'test' || data.password !== 'test') {
      setError('username', 'invalid', 'Invalid username');
      setError('password', 'invalid', 'Invalid password');
    }
    setComplete(true);
  };
  return (
    <>
      <NormalizeStyles />
      <BaseStyles />
      <Container>
        <LoginWrapper>
          <Login onSubmit={onSubmit} />
        </LoginWrapper>
      </Container>
    </>
  );
};
