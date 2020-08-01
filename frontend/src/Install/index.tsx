import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import Register from 'shared/components/Register';
import { Container, LoginWrapper } from './Styles';
import { useCreateUserAccountMutation, useMeQuery, MeDocument, MeQuery } from 'shared/generated/graphql';
import { useHistory } from 'react-router';
import { getAccessToken, setAccessToken } from 'shared/utils/accessToken';
import updateApolloCache from 'shared/utils/cache';
import produce from 'immer';
import { useApolloClient } from '@apollo/react-hooks';
import UserContext, { PermissionLevel, PermissionObjectType } from 'App/context';
import jwtDecode from 'jwt-decode';

const Install = () => {
  const client = useApolloClient();
  const history = useHistory();
  const { setUser } = useContext(UserContext);
  useEffect(() => {
    fetch('/auth/refresh_token', {
      method: 'POST',
      credentials: 'include',
    }).then(async x => {
      const { status } = x;
      const response: RefreshTokenResponse = await x.json();
      const { isInstalled } = response;
      if (status === 200 && isInstalled) {
        history.replace('/projects');
      }
    });
  }, []);
  return (
    <Container>
      <LoginWrapper>
        <Register
          onSubmit={(data, setComplete, setError) => {
            const accessToken = getAccessToken();
            if (data.password !== data.password_confirm) {
              setError('password', { type: 'error', message: 'Passwords must match' });
              setError('password_confirm', { type: 'error', message: 'Passwords must match' });
            } else {
              axios
                .post(
                  '/auth/install',
                  {
                    user: {
                      username: data.username,
                      roleCode: 'admin',
                      email: data.email,
                      password: data.password,
                      initials: data.initials,
                      fullname: data.fullname,
                    },
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  },
                )
                .then(async x => {
                  const { status } = x;
                  if (status === 400) {
                    history.replace('/login');
                  } else {
                    const response: RefreshTokenResponse = await x.data;
                    const { accessToken, isInstalled } = response;
                    const claims: JWTToken = jwtDecode(accessToken);
                    const currentUser = {
                      id: claims.userId,
                      roles: {
                        org: claims.orgRole,
                        teams: new Map<string, string>(),
                        projects: new Map<string, string>(),
                      },
                    };
                    setUser(currentUser);
                    setAccessToken(accessToken);
                    if (!isInstalled) {
                      history.replace('/install');
                    }
                  }
                  history.push('/projects');
                });
            }
            setComplete(true);
          }}
        />
      </LoginWrapper>
    </Container>
  );
};

export default Install;
