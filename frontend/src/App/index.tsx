import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { PopupProvider } from 'shared/components/PopupMenu';
import { setAccessToken } from 'shared/utils/accessToken';
import { ThemeProvider } from 'styled-components';
import NormalizeStyles from './NormalizeStyles';
import BaseStyles from './BaseStyles';
import { theme } from './ThemeStyles';
import Routes from './Routes';
import { UserContext, CurrentUserRaw, CurrentUserRoles } from './context';

const history = createBrowserHistory();
type RefreshTokenResponse = {
  accessToken: string;
  isInstalled: boolean;
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<CurrentUserRaw | null>(null);
  const setUserRoles = (roles: CurrentUserRoles) => {
    if (user) {
      setUser({
        ...user,
        roles,
      });
    }
  };

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
        const currentUser = {
          id: claims.userId,
          roles: { org: claims.orgRole, teams: new Map<string, string>(), projects: new Map<string, string>() },
        };
        setUser(currentUser);
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
      <UserContext.Provider value={{ user, setUser, setUserRoles }}>
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
      </UserContext.Provider>
    </>
  );
};

export default App;
