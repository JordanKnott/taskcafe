import React, { useState, useEffect } from 'react';
import { createBrowserHistory } from 'history';
import { setAccessToken } from 'shared/utils/accessToken';
import NormalizeStyles from './NormalizeStyles';
import BaseStyles from './BaseStyles';
import Routes from './Routes';

const history = createBrowserHistory();

const App = () => {
  const [loading, setLoading] = useState(true);

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
        setAccessToken(accessToken);
      }
      // }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }
  return (
    <>
      <NormalizeStyles />
      <BaseStyles />
      <Routes history={history} />
    </>
  );
};

export default App;
