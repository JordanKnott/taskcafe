import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { createBrowserHistory } from 'history';
import { setAccessToken } from 'shared/utils/accessToken';
import styled from 'styled-components';
import NormalizeStyles from './NormalizeStyles';
import BaseStyles from './BaseStyles';
import Routes from './Routes';
import { UserIDContext } from './context';
import Navbar from './Navbar';
import { Router } from 'react-router';
import { PopupProvider } from 'shared/components/PopupMenu';

const history = createBrowserHistory();

const MainContent = styled.div`
  padding: 0 0 50px 80px;
  background: #262c49;
  height: 100%;
`;

const App = () => {
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3333/auth/refresh_token', {
      method: 'POST',
      credentials: 'include',
    }).then(async x => {
      const { status } = x;
      if (status === 400) {
        history.replace('/login');
      } else {
        const response: RefreshTokenResponse = await x.json();
        const { accessToken } = response;
        const claims: JWTToken = jwtDecode(accessToken);
        setUserID(claims.userId);
        setAccessToken(accessToken);
      }
      setLoading(false);
    });
  }, []);

  return (
    <>
      <UserIDContext.Provider value={{ userID, setUserID }}>
        <PopupProvider>
          <NormalizeStyles />
          <BaseStyles />
          <Router history={history}>
            {loading ? (
              <div>loading</div>
            ) : (
              <>
                <Navbar />
                <MainContent>
                  <Routes history={history} />
                </MainContent>
              </>
            )}
          </Router>
        </PopupProvider>
      </UserIDContext.Provider>
    </>
  );
};

export default App;
