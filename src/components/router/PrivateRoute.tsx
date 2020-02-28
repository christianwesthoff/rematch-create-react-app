import { Route, Redirect, useLocation } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { Claims } from 'models/userInfo';
import ConditionalRoute from './ConditionalRoute';

export type PRProps = {
  filter?: ((claims: Claims) => boolean) | undefined
} & any;

const PrivateRoute = ({component: Component, filter, ...props }: PRProps) => {
  const location = useLocation();
  return (
    <ConditionalRoute {...props} when={(state: RootState) => 
      state.auth.isAuthorized && (!filter || filter(state.userInfo.claims || {}))} else="/login" />
  );
};

export default PrivateRoute;