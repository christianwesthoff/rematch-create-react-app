import { Route, Redirect } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'app/store';
import { Claims } from 'models/userInfo';

export type CRProps = {
  filter: (claims: Claims) => boolean
} & any;

const ConditionalRoute = ({ children, filter, ...props }: CRProps) => {
  const isAuthorized = useSelector((state: RootState) => filter(state.userInfo.claims || {}));
  return (
    <Route
      { ...props }
      render={() =>
        isAuthorized ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/',
            }}
          />
        )
      }
    />
  );
};

export default ConditionalRoute;