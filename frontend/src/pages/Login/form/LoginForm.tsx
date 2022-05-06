import React from 'react';
import { FieldError, useForm, UseFormSetError } from 'react-hook-form';
import Form from 'shared/components/form';
import styled from 'styled-components';
import DefaultFormButton from 'shared/components/form/FormButton';
import DefaultFormTextField from 'shared/components/form/FormTextField';
import DefaultFormPasswordField from 'shared/components/form/FormPasswordField';

const FormTextField = styled(DefaultFormTextField)`
  margin-top: 12px;
`;

const FormPasswordField = styled(DefaultFormPasswordField)`
  margin-top: 12px;
`;

const FormButton = styled(DefaultFormButton)`
  margin-top: 20px;
  margin-bottom: 12px;
`;

export type LoginFormData = {
  username: string;
  password: string;
};

export type OnLoginFn = (data: LoginFormData, setError: UseFormSetError<LoginFormData>) => void;

type LoginFormProps = {
  onLogin: OnLoginFn;
  onForgotPassword: () => void;
  isLoading: boolean;
};

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onForgotPassword, isLoading }) => {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const onSubmit = (data: LoginFormData) => {
    onLogin(data, setError);
  };
  return (
    <Form>
      <FormTextField
        error={errors.username?.message}
        label="Username"
        {...register('username', { required: 'Username is required' })}
      />
      <FormPasswordField
        label="Password"
        error={errors.password?.message}
        secondaryLabel={{ label: 'Forgot Password?', onClick: onForgotPassword }}
        {...register('password', { required: 'Password is required' })}
      />
      <FormButton disabled={isLoading} width="100%" onClick={handleSubmit(onSubmit)}>
        Login
      </FormButton>
    </Form>
  );
};

export default LoginForm;
