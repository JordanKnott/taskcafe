import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import * as H from 'history';

import Dashboard from 'Dashboard';
import Admin from 'Admin';
import Projects from 'Projects';
import Project from 'Projects/Project';
import Teams from 'Teams';
import Login from 'Auth';
import Profile from 'Profile';
import styled from 'styled-components';

const MainContent = styled.div`
  padding: 0 0 0 0;
  background: #262c49;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
type RoutesProps = {
  history: H.History;
};

const Routes = ({ history }: RoutesProps) => (
  <Switch>
    <Route exact path="/login" component={Login} />
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

export default Routes;
