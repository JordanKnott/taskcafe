import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from 'Dashboard';
import Admin from 'Admin';
import Projects from 'Projects';
import Project from 'Projects/Project';
import Teams from 'Teams';
import Login from 'Auth';
import Install from 'Install';
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

const Routes = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <Route exact path="/install" component={Install} />
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
