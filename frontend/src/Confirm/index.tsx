import React, { useState } from 'react';
import axios from 'axios';
import Confirm from 'shared/components/Confirm';
import { useHistory, useLocation } from 'react-router';
import * as QueryString from 'query-string';
import { toast } from 'react-toastify';
import { Container, LoginWrapper } from './Styles';
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
                  const { userID } = response;
                  setUser(userID);
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
