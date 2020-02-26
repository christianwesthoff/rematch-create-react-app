import { Route, Redirect } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'app/store';

const ProtectedRoute = ({ children, ...props }: any) => {
  const isAuthorized = useSelector((state: RootState) => state.auth.isAuthorized);
  return (
    <Route
      { ...props }
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

export default ProtectedRoute;