import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router';
import Login from 'shared/components/Login';
import UserContext from 'App/context';
import { Container, LoginWrapper } from './Styles';

const Auth = () => {
  const [invalidLoginAttempt, setInvalidLoginAttempt] = useState(0);
  const history = useHistory();
  const location = useLocation<{ redirect: string } | undefined>();
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
    }).then(async (x) => {
      if (x.status === 401) {
        setInvalidLoginAttempt(invalidLoginAttempt + 1);
        setError('username', { type: 'error', message: 'Invalid username' });
        setError('password', { type: 'error', message: 'Invalid password' });
        setComplete(true);
      } else {
        const response = await x.json();
        const { userID } = response;
        setUser(userID);
        if (location.state && location.state.redirect) {
          history.push(location.state.redirect);
        } else {
          history.push('/');
        }
      }
    });
  };

  useEffect(() => {
    fetch('/auth/validate', {
      method: 'POST',
      credentials: 'include',
    }).then(async (x) => {
      const response = await x.json();
      const { valid, userID } = response;
      if (valid) {
        setUser(userID);
        history.replace('/projects');
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
