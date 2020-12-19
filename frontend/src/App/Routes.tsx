import React, { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import * as H from 'history';

import Dashboard from 'Dashboard';
import Admin from 'Admin';
import Confirm from 'Confirm';
import Projects from 'Projects';
import Project from 'Projects/Project';
import Teams from 'Teams';
import Login from 'Auth';
import Register from 'Register';
import Profile from 'Profile';
import styled from 'styled-components';
import JwtDecode from 'jwt-decode';
import { setAccessToken } from 'shared/utils/accessToken';
import { useCurrentUser } from 'App/context';

const MainContent = styled.div`
  padding: 0 0 0 0;
  background: #262c49;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

type RefreshTokenResponse = {
  accessToken: string;
  setup?: null | { confirmToken: string };
};

const AuthorizedRoutes = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const { setUser } = useCurrentUser();
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
        }
      }
      setLoading(false);
    });
  }, []);
  return loading ? null : (
    <Switch>
      <MainContent>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/projects" component={Projects} />
        <Route path="/projects/:projectID" component={Project} />
        <Route path="/teams/:teamID" component={Teams} />
        <Route path="/profile" component={Profile} />
        <Route path="/admin" component={Admin} />
      </MainContent>
    </Switch>
  );
};

type RoutesProps = {
  history: H.History;
};

const Routes: React.FC<RoutesProps> = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <Route exact path="/register" component={Register} />
    <Route exact path="/confirm" component={Confirm} />
    <AuthorizedRoutes />
  </Switch>
);

export default Routes;
