import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import * as H from 'history';

import Projects from 'Projects';
import Project from 'Projects/Project';
import Login from 'Auth';

type RoutesProps = {
  history: H.History;
};

const Routes = ({ history }: RoutesProps) => (
  <Router history={history}>
    <Switch>
      <Route exact path="/projects" component={Projects} />
      <Route exact path="/projects/:projectId" component={Project} />
      <Route exact path="/login" component={Login} />
    </Switch>
  </Router>
);

export default Routes;
