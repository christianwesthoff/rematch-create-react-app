import { Route, Redirect, useLocation } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { Claims } from 'models/userInfo';

export type CRProps = {
  filter?: ((claims: Claims) => boolean) | undefined
} & any;

const PrivateRoute = ({component: Component, filter, ...props }: CRProps) => {
  const isAuthorized = useSelector((state: RootState) => state.auth.isAuthorized && (!filter || filter(state.userInfo.claims || {})));
  const location = useLocation();
  return (
    <Route {...props} render={props => (
      isAuthorized ?
          <Component {...props} />
      : <Redirect to={{
        pathname: "/login",
        state: { from: location }
      }} />
    )} />
  );
};

export default PrivateRoute;