import React, { useState } from 'react';
import AccessAccount from 'shared/undraw/AccessAccount';
import { User, Lock } from 'shared/icons';
import { useForm } from 'react-hook-form';

import {
  Form,
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
                  <User color="#c2c6dc" size={20} />
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
                  <Lock color="#c2c6dc" size={20} />
                </FormIcon>
              </FormLabel>
              {errors.password && <FormError>{errors.password.message}</FormError>}

              <ActionButtons>
                <RegisterButton>Register</RegisterButton>
                <LoginButton type="submit" value="Login" disabled={!isComplete} />
              </ActionButtons>
            </Form>
          </LoginFormContainer>
        </LoginFormWrapper>
      </Column>
    </Wrapper>
  );
};

export default Login;
