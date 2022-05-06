import React from 'react';
import InfoCircle from 'shared/components/icons/solid/InfoCircle';
import AuthPageLayout from 'shared/components/layout/AuthPageLayout';
import LoginForm, { OnLoginFn } from 'pages/Login/form/LoginForm';
import * as S from './Styles';

type LoginPageProps = {
  isLoading: boolean;
  onLogin: OnLoginFn;
  onRegister?: () => void;
  alert?: string;
};

const LoginPage: React.FC<LoginPageProps> = ({ isLoading, alert, onRegister }) => {
  return (
    <AuthPageLayout>
      <S.Welcome>Welcome to Taskcafe</S.Welcome>
      {alert && (
        <S.Alert>
          <S.AlertContent>{alert}</S.AlertContent>
          <S.AlertIcon>
            <InfoCircle stroke="danger" fill="danger" />
          </S.AlertIcon>
        </S.Alert>
      )}
      <LoginForm
        isLoading={isLoading}
        onLogin={() => {
          // TODO
        }}
        onForgotPassword={() => {
          // TODO
        }}
      />
      {!isLoading && (
        <>
          {onRegister && (
            <S.Register>
              New to Taskcafe? <S.RegisterLink to="/register">Create an account</S.RegisterLink>
            </S.Register>
          )}
          <S.Divider>
            <S.DividerText>or</S.DividerText>
          </S.Divider>
        </>
      )}
    </AuthPageLayout>
  );
};

export default LoginPage;
