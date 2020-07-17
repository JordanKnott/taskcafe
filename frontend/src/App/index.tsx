import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { PopupProvider } from 'shared/components/PopupMenu';
import { setAccessToken } from 'shared/utils/accessToken';
import styled, { ThemeProvider } from 'styled-components';
import NormalizeStyles from './NormalizeStyles';
import BaseStyles from './BaseStyles';
import { theme } from './ThemeStyles';
import Routes from './Routes';
import { UserIDContext } from './context';
import Navbar from './Navbar';

const history = createBrowserHistory();
type RefreshTokenResponse = {
  accessToken: string;
  isInstalled: boolean;
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    fetch('/auth/refresh_token', {
      method: 'POST',
      credentials: 'include',
    }).then(async x => {
      const { status } = x;
      if (status === 400) {
        history.replace('/login');
      } else {
        const response: RefreshTokenResponse = await x.json();
        const { accessToken, isInstalled } = response;
        const claims: JWTToken = jwtDecode(accessToken);
        setUserID(claims.userId);
        setAccessToken(accessToken);
        if (!isInstalled) {
          history.replace('/install');
        }
      }
      setLoading(false);
    });
  }, []);

  return (
    <>
      <UserIDContext.Provider value={{ userID, setUserID }}>
        <ThemeProvider theme={theme}>
          <NormalizeStyles />
          <BaseStyles />
          <Router history={history}>
            <PopupProvider>
              {loading ? (
                <div>loading</div>
              ) : (
                <>
                  <Routes history={history} />
                </>
              )}
            </PopupProvider>
          </Router>
        </ThemeProvider>
      </UserIDContext.Provider>
    </>
  );
};

export default App;
