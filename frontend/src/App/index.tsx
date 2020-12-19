import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { PopupProvider } from 'shared/components/PopupMenu';
import { ToastContainer } from 'react-toastify';
import { setAccessToken } from 'shared/utils/accessToken';
import styled, { ThemeProvider } from 'styled-components';
import NormalizeStyles from './NormalizeStyles';
import BaseStyles from './BaseStyles';
import theme from './ThemeStyles';
import Routes from './Routes';
import { UserContext, CurrentUserRaw, CurrentUserRoles, PermissionLevel, PermissionObjectType } from './context';

import 'react-toastify/dist/ReactToastify.css';

const StyledContainer = styled(ToastContainer).attrs({
  // custom props
})`
  .Toastify__toast-container {
  }
  .Toastify__toast {
    padding: 5px;
    margin-left: 5px;
    margin-right: 5px;
    border-radius: 10px;
    background: #7367f0;
    color: #fff;
  }
  .Toastify__toast--error {
    background: ${props => props.theme.colors.danger};
  }
  .Toastify__toast--warning {
    background: ${props => props.theme.colors.warning};
  }
  .Toastify__toast--success {
    background: ${props => props.theme.colors.success};
  }
  .Toastify__toast-body {
  }
  .Toastify__progress-bar {
  }
  .Toastify__close-button {
    display: none;
  }
`;

const history = createBrowserHistory();

const App = () => {
  const [user, setUser] = useState<CurrentUserRaw | null>(null);
  const setUserRoles = (roles: CurrentUserRoles) => {
    if (user) {
      setUser({
        ...user,
        roles,
      });
    }
  };

  return (
    <>
      <UserContext.Provider value={{ user, setUser, setUserRoles }}>
        <ThemeProvider theme={theme}>
          <NormalizeStyles />
          <BaseStyles />
          <Router history={history}>
            <PopupProvider>
              <Routes history={history} />
            </PopupProvider>
          </Router>
          <StyledContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            limit={5}
          />
        </ThemeProvider>
      </UserContext.Provider>
    </>
  );
};

export default App;
