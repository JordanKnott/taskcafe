import React, { useState, useEffect } from 'react';
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

const Confirm = ({ hasFailed, hasConfirmToken }: ConfirmProps) => {
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
            {hasConfirmToken ? (
              <>
                <Title>Confirming user...</Title>
                {hasFailed ? <SubTitle>There was an error while confirming your user</SubTitle> : <LoadingSpinner />}
              </>
            ) : (
              <>
                <Title>There is no confirmation token</Title>
                <SubTitle>There seems to have been an error.</SubTitle>
              </>
            )}
          </LoginFormContainer>
        </LoginFormWrapper>
      </Column>
    </Wrapper>
  );
};

export default Confirm;
