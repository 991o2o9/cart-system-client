import { paths } from '@src/shared/constants/constants';
import { useAuth } from '@src/shared/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const AuthGuard = ({ children }) => {
  const { isAuth } = useAuth();

  return isAuth ? children : <Navigate to={paths.homePage} replace />;
};
