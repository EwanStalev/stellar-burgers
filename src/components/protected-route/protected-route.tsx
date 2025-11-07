import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from '../../services/store';

export const ProtectedRoute: FC<{
  children: ReactNode;
  isAuthPage?: boolean;
}> = ({ children, isAuthPage = false }) => {
  const { isAuth } = useSelector((state) => state.auth);

  if (!isAuth && isAuthPage) {
    return children;
  }
  return isAuth ? (
    children
  ) : (
    <Navigate to='/login' state={{ from: window.location.pathname }} />
  );
};
