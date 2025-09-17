import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getCookie } from '../../utils/cookie';

export const ProtectedRoute: FC<{
  children: ReactNode;
  isAuthPage?: boolean;
}> = ({ children, isAuthPage = false }) => {
  if (!getCookie('accessToken') && isAuthPage) {
    return children;
  }
  return getCookie('accessToken') ? children : <Navigate to='/login' />;
};
