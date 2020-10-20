import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import JwtDecode from 'jwt-decode';
import { setAccessToken } from 'shared/utils/accessToken';
import Login from 'shared/components/Login';
import UserContext from 'App/context';
import { Container, LoginWrapper } from './Styles';

const Auth = () => {
  const [invalidLoginAttempt, setInvalidLoginAttempt] = useState(0);
  const history = useHistory();
  const { setUser } = useContext(UserContext);
  const login = (
    data: LoginFormData,
    setComplete: (val: boolean) => void,
    setError: (name: 'username' | 'password', error: ErrorOption) => void,
  ) => {
    fetch('/auth/login', {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({
        username: data.username,
        password: data.password,
      }),
    }).then(async x => {
      if (x.status === 401) {
        setInvalidLoginAttempt(invalidLoginAttempt + 1);
        setError('username', { type: 'error', message: 'Invalid username' });
        setError('password', { type: 'error', message: 'Invalid password' });
        setComplete(true);
      } else {
        const response = await x.json();
        const { accessToken } = response;
        const claims: JWTToken = JwtDecode(accessToken);
        const currentUser = {
          id: claims.userId,
          roles: { org: claims.orgRole, teams: new Map<string, string>(), projects: new Map<string, string>() },
        };
        setUser(currentUser);
        setComplete(true);
        setAccessToken(accessToken);

        history.push('/');
      }
    });
  };

  useEffect(() => {
    fetch('/auth/refresh_token', {
      method: 'POST',
      credentials: 'include',
    }).then(async x => {
      const { status } = x;
      if (status === 200) {
        const response: RefreshTokenResponse = await x.json();
        const { accessToken, setup } = response;
        if (setup) {
          history.replace(`/register?confirmToken=${setup.confirmToken}`);
        } else {
          const claims: JWTToken = JwtDecode(accessToken);
          const currentUser = {
            id: claims.userId,
            roles: { org: claims.orgRole, teams: new Map<string, string>(), projects: new Map<string, string>() },
          };
          setUser(currentUser);
          setAccessToken(accessToken);
          history.replace('/projects');
        }
      }
    });
  }, []);

  return (
    <Container>
      <LoginWrapper>
        <Login onSubmit={login} />
      </LoginWrapper>
    </Container>
  );
};

export default Auth;
