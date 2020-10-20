import React, { useState } from 'react';
import axios from 'axios';
import Confirm from 'shared/components/Confirm';
import { useHistory, useLocation } from 'react-router';
import * as QueryString from 'query-string';
import { toast } from 'react-toastify';
import { Container, LoginWrapper } from './Styles';
import JwtDecode from 'jwt-decode';
import { setAccessToken } from 'shared/utils/accessToken';
import { useCurrentUser } from 'App/context';

const UsersConfirm = () => {
  const history = useHistory();
  const location = useLocation();
  const [registered, setRegistered] = useState(false);
  const params = QueryString.parse(location.search);
  const { setUser } = useCurrentUser();
  return (
    <Container>
      <LoginWrapper>
        <Confirm
          hasConfirmToken={params.confirmToken !== undefined}
          onConfirmUser={setFailed => {
            fetch('/auth/confirm', {
              method: 'POST',
              body: JSON.stringify({
                confirmToken: params.confirmToken,
              }),
            })
              .then(async x => {
                const { status } = x;
                if (status === 200) {
                  const response = await x.json();
                  const { accessToken } = response;
                  const claims: JWTToken = JwtDecode(accessToken);
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
                  history.push('/');
                } else {
                  setFailed();
                }
              })
              .catch(() => {
                setFailed();
              });
          }}
        />
      </LoginWrapper>
    </Container>
  );
};

export default UsersConfirm;
