import { AppRoute, AuthorizationStatus } from '../../const';
import { RootState } from '../../store/root-reducer';
import { useGetUser } from '../../hooks/useGetUser';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ReactElement } from 'react';

interface PrivateRouteProps {
  element: ReactElement;
  isAdminRoute?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, isAdminRoute = false }) => {
  const authorizationStatus = useSelector((state: RootState) => state.auth.authorizationStatus);
  const user = useGetUser();

  if (authorizationStatus !== AuthorizationStatus.Auth) {
    return <Navigate to={AppRoute.Root} />;
  }

  if (isAdminRoute && !user?.isAdmin) {
    return <Navigate to={AppRoute.Root} />;
  }

  return element;
};

export default PrivateRoute;
