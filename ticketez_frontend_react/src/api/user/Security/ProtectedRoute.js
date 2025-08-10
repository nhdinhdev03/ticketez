import React from 'react';
import { Navigate } from 'react-router-dom';
import Unauthorized from '~/pages/NotFound/Unauthorized';
import NotFound from '~/pages/NotFound/notFound';
import { getRolesFromLocalStorage } from '~/utils/authUtils';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  // console.log(isAuthenticated);
  const userRoles = getRolesFromLocalStorage();

  const hasRequiredRole = userRoles.includes('SUPER_ADMIN') ||
    userRoles.includes('MOVIE_MANAGEMENT_ADMIN') ||
    userRoles.includes('SCHEDULING_PRICING_ADMIN') ||
    userRoles.includes('CINEMA_MANAGEMENT_ADMIN') ||
    userRoles.includes('SERVICE_EVENT_MANAGEMENT_ADMIN') ||
    userRoles.includes('USER_MANAGEMENT_ADMIN')||
    userRoles.includes('USER');

  const userHasRequiredRole = allowedRoles ? allowedRoles.some(role => userRoles.includes(role)) : true;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (!isAuthenticated || !hasRequiredRole) {
    return <NotFound />;
  }
  if (!hasRequiredRole) {
    return <Navigate to="/" />;
  }
  if (!allowedRoles) {
      return <Navigate to="/login" />;
  }
  if (!userRoles) {
    return <Navigate to="/login" />;
  }

  if (!userHasRequiredRole) {
    return <Unauthorized />;
  }

  return children;
};

export default ProtectedRoute;
