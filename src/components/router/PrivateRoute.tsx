import { Route, Redirect } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const PrivateRoute = ({component: Component, ...props }: any) => {
  const isAuthorized = useSelector((state: RootState) => state.auth.isAuthorized);
  return (
    <Route {...props} render={props => (
      isAuthorized ?
          <Component {...props} />
      : <Redirect to="/login" />
    )} />
  );
};

export default PrivateRoute;