import React, { useState } from 'react';
import axios from 'axios';
import Register from 'shared/components/Register';
import { useHistory, useLocation } from 'react-router';
import * as QueryString from 'query-string';
import { toast } from 'react-toastify';
import { Container, LoginWrapper } from './Styles';

const UsersRegister = () => {
  const history = useHistory();
  const location = useLocation();
  const [registered, setRegistered] = useState(false);
  const params = QueryString.parse(location.search);
  return (
    <Container>
      <LoginWrapper>
        <Register
          registered={registered}
          onSubmit={(data, setComplete, setError) => {
            let isRedirected = false;
            if (data.password !== data.password_confirm) {
              setError('password', { type: 'error', message: 'Passwords must match' });
              setError('password_confirm', { type: 'error', message: 'Passwords must match' });
            } else {
              // TODO: change to fetch?
              fetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                  user: {
                    username: data.username,
                    roleCode: 'admin',
                    email: data.email,
                    password: data.password,
                    initials: data.initials,
                    fullname: data.fullname,
                  },
                }),
              })
                .then(async (x) => {
                  const response = await x.json();
                  const { setup } = response;
                  if (setup) {
                    history.replace(`/confirm?confirmToken=xxxx`);
                    isRedirected = true;
                  } else if (params.confirmToken) {
                    history.replace(`/confirm?confirmToken=${params.confirmToken}`);
                    isRedirected = true;
                  } else {
                    setRegistered(true);
                  }
                })
                .catch((e) => {
                  toast('There was an issue trying to register');
                });
            }
            if (!isRedirected) {
              setComplete(true);
            }
          }}
        />
      </LoginWrapper>
    </Container>
  );
};

export default UsersRegister;
