import React, { useState, useEffect } from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { PopupProvider } from 'shared/components/PopupMenu';
import { ToastContainer } from 'react-toastify';
import styled, { ThemeProvider } from 'styled-components';
import NormalizeStyles from './NormalizeStyles';
import BaseStyles from './BaseStyles';
import theme from './ThemeStyles';
import Routes from './Routes';
import { UserContext } from './context';

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
  const [user, setUser] = useState<string | null>(null);

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
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
