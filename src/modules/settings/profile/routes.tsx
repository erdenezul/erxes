import queryString from 'query-string';
import * as React from 'react';
import { Route } from 'react-router-dom';
import { Profile } from './containers';

const routes = () => (
  <React.Fragment>
    <Route
      path="/profile"
      exact
      key="/profile"
      component={({ location }) => {
        const queryParams = queryString.parse(location.search);
        return <Profile queryParams={queryParams} />;
      }}
    />
  </React.Fragment>
);

export default routes;
