import React, { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import * as H from 'history';

import Dashboard from 'Dashboard';
import Admin from 'Admin';
import MyTasks from 'MyTasks';
import Confirm from 'Confirm';
import Projects from 'Projects';
import Project from 'Projects/Project';
import Teams from 'Teams';
import Login from 'Auth';
import Register from 'Register';
import Profile from 'Profile';
import styled from 'styled-components';
import { useCurrentUser } from 'App/context';

const MainContent = styled.div`
  padding: 0 0 0 0;
  background: #262c49;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

type ValidateTokenResponse = {
  valid: boolean;
  userID: string;
};

const AuthorizedRoutes = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const { setUser } = useCurrentUser();
  useEffect(() => {
    fetch('/auth/validate', {
      method: 'POST',
      credentials: 'include',
    }).then(async x => {
      const { status } = x;
      const response: ValidateTokenResponse = await x.json();
      const { valid, userID } = response;
      if (!valid) {
        history.replace(`/login`);
      } else {
        setUser(userID);
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
        <Route path="/tasks" component={MyTasks} />
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
