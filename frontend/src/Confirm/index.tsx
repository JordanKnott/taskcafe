import React, { useEffect, useState } from 'react';
import Confirm from 'shared/components/Confirm';
import { useHistory, useLocation } from 'react-router';
import * as QueryString from 'query-string';
import { useCurrentUser } from 'App/context';
import { Container, LoginWrapper } from './Styles';

const UsersConfirm = () => {
  const history = useHistory();
  const location = useLocation();
  const params = QueryString.parse(location.search);
  const [hasFailed, setFailed] = useState(false);
  const { setUser } = useCurrentUser();
  useEffect(() => {
    fetch('/auth/confirm', {
      method: 'POST',
      body: JSON.stringify({
        confirmToken: params.confirmToken,
      }),
    })
      .then(async (x) => {
        const { status } = x;
        if (status === 200) {
          const response = await x.json();
          const { userID } = response;
          setUser(userID);
          history.push('/');
        } else {
          setFailed(true);
        }
      })
      .catch(() => {
        setFailed(false);
      });
  }, []);
  return (
    <Container>
      <LoginWrapper>
        <Confirm hasConfirmToken={params.confirmToken !== undefined} hasFailed={hasFailed} />
      </LoginWrapper>
    </Container>
  );
};

export default UsersConfirm;
