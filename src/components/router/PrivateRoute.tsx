import { Route, Redirect } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'app/store';

const PrivateRoute = ({ children, ...rest }: any) => {
  const isAuthorized = useSelector((state: RootState) => state.auth.isAuthorized);
  return (
    <Route
      {...rest}
      render={() =>
        isAuthorized ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;