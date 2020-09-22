import React, { useState } from 'react';
import AccessAccount from 'shared/undraw/AccessAccount';
import { User, Lock, Taskcafe } from 'shared/icons';
import { useForm } from 'react-hook-form';

import LoadingSpinner from 'shared/components/LoadingSpinner';
import {
  Form,
  LogoWrapper,
  LogoTitle,
  ActionButtons,
  RegisterButton,
  LoginButton,
  FormError,
  FormIcon,
  FormLabel,
  FormTextInput,
  Wrapper,
  Column,
  LoginFormWrapper,
  LoginFormContainer,
  Title,
  SubTitle,
} from './Styles';

const Login = ({ onSubmit }: LoginProps) => {
  const [isComplete, setComplete] = useState(true);
  const { register, handleSubmit, errors, setError, formState } = useForm<LoginFormData>();
  const loginSubmit = (data: LoginFormData) => {
    setComplete(false);
    onSubmit(data, setComplete, setError);
  };
  return (
    <Wrapper>
      <Column>
        <AccessAccount width={275} height={250} />
      </Column>
      <Column>
        <LoginFormWrapper>
          <LoginFormContainer>
            <LogoWrapper>
              <Taskcafe width={42} height={42} />
              <LogoTitle>Taskcafé</LogoTitle>
            </LogoWrapper>
            <Title>Login</Title>
            <SubTitle>Welcome back, please login into your account.</SubTitle>
            <Form onSubmit={handleSubmit(loginSubmit)}>
              <FormLabel htmlFor="username">
                Username
                <FormTextInput
                  type="text"
                  id="username"
                  name="username"
                  ref={register({ required: 'Username is required' })}
                />
                <FormIcon>
                  <User width={20} height={20} />
                </FormIcon>
              </FormLabel>
              {errors.username && <FormError>{errors.username.message}</FormError>}
              <FormLabel htmlFor="password">
                Password
                <FormTextInput
                  type="password"
                  id="password"
                  name="password"
                  ref={register({ required: 'Password is required' })}
                />
                <FormIcon>
                  <Lock width={20} height={20} />
                </FormIcon>
              </FormLabel>
              {errors.password && <FormError>{errors.password.message}</FormError>}

              <ActionButtons>
                <RegisterButton variant="outline">Register</RegisterButton>
                {!isComplete && <LoadingSpinner size="32px" thickness="2px" borderSize="48px" />}
                <LoginButton type="submit" disabled={!isComplete}>
                  Login
                </LoginButton>
              </ActionButtons>
            </Form>
          </LoginFormContainer>
        </LoginFormWrapper>
      </Column>
    </Wrapper>
  );
};

export default Login;
