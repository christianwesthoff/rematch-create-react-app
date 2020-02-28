import { useLocation } from 'react-router-dom';
import React from 'react';
import { RootState } from 'store';
import { Claims } from 'models/userInfo';
import ConditionalRoute from './ConditionalRoute';

export type PRProps = {
} & any;

const PrivateRoute = ({component: Component, ...props }: PRProps) => {
  const location = useLocation();
  return (
    <ConditionalRoute {...props} when={(state: RootState) => state.auth.isAuthorized} redirect="/login" meta={{ from: location }} />
  );
};

export default PrivateRoute;