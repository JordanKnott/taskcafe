import React from 'react';
import styled from 'styled-components';
import NormalizeStyles from 'App/NormalizeStyles';
import BaseStyles from 'App/BaseStyles';
import { Home } from 'shared/icons';
import Navbar, { ActionButton, ButtonContainer, PrimaryLogo } from '.';

export default {
  component: Navbar,
  title: 'Navbar',
  parameters: {
    backgrounds: [
      { name: 'white', value: '#ffffff', default: true },
      { name: 'gray', value: '#cdd3e1' },
    ],
  },
};
const MainContent = styled.div`
  padding: 0 0 50px 80px;
`;

export const Default = () => {
  return (
    <>
      <NormalizeStyles />
      <BaseStyles />
      <Navbar>
        <PrimaryLogo />
        <ButtonContainer>
          <ActionButton name="Home">
            <Home width={28} height={28} />
          </ActionButton>
          <ActionButton name="Home">
            <Home width={28} height={28} />
          </ActionButton>
        </ButtonContainer>
      </Navbar>
    </>
  );
};
