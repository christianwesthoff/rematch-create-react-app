import { Route, Redirect } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

export type CRProps = {
  when: (claims: RootState) => boolean
  redirect: string
} & any;

const ConditionalRoute = ({component: Component, when, redirect, ...props }: CRProps) => {
  const isTrue = useSelector((state: RootState) => when(state));
  return (
    <Route {...props} render={props => (
      isTrue ?
          <Component {...props} />
      : <Redirect to={{
        pathname: redirect
      }} />
    )} />
  );
};

export default ConditionalRoute;