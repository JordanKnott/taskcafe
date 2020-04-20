import React, { useContext } from 'react';
import { Home, Stack } from 'shared/icons';
import Navbar, { ActionButton, ButtonContainer, PrimaryLogo } from 'shared/components/Navbar';
import { Link } from 'react-router-dom';
import UserIDContext from './context';

const GlobalNavbar = () => {
  const { userID } = useContext(UserIDContext);
  if (!userID) {
    return null;
  }
  return (
    <Navbar>
      <PrimaryLogo />
      <ButtonContainer>
        <Link to="/">
          <ActionButton name="Home">
            <Home size={28} color="#c2c6dc" />
          </ActionButton>
        </Link>
        <Link to="/projects">
          <ActionButton name="Projects">
            <Stack size={28} color="#c2c6dc" />
          </ActionButton>
        </Link>
      </ButtonContainer>
    </Navbar>
  );
};

export default GlobalNavbar;
