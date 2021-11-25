import React, { useEffect, useState } from 'react';
import AccessAccount from 'shared/undraw/AccessAccount';
import { User, Lock, Taskcafe } from 'shared/icons';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
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
  const [showRegistration, setShowRegistration] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>();
  const loginSubmit = (data: LoginFormData) => {
    setComplete(false);
    onSubmit(data, setComplete, setError);
  };
  const history = useHistory();
  useEffect(() => {
    fetch('/settings').then(async (x) => {
      const { isConfigured, allowPublicRegistration } = await x.json();
      if (!isConfigured) {
        history.push('/register');
      } else if (allowPublicRegistration) {
        setShowRegistration(true);
      }
    });
  }, []);
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
                  placeholder="Username"
                  type="text"
                  {...register('username', { required: 'Username is required' })}
                />
                <FormIcon>
                  <User width={20} height={20} />
                </FormIcon>
              </FormLabel>
              {errors.username && <FormError>{errors.username.message}</FormError>}
              <FormLabel htmlFor="password">
                Password
                <FormTextInput
                  placeholder="Password"
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                />
                <FormIcon>
                  <Lock width={20} height={20} />
                </FormIcon>
              </FormLabel>
              {errors.password && <FormError>{errors.password.message}</FormError>}

              <ActionButtons>
                {showRegistration ? <RegisterButton variant="outline">Register</RegisterButton> : <div />}
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
