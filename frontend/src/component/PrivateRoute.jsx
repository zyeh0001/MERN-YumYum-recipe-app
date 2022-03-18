import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import Spinner from './Spinner';

const PrivateRoute = () => {
  const { loggedIn, isCheckingStatus } = useAuthStatus();

  if (isCheckingStatus) return <Spinner />;

  return loggedIn ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;
