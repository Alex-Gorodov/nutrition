import { useSelector } from "react-redux";
import { Hero } from "../../components/hero/hero";
import { RootState } from "../../store/root-reducer";
import { AppRoute, AuthorizationStatus } from "../../const";
import { Navigate } from "react-router-dom";

export function LandingPage(): JSX.Element {
  const isAuth = useSelector((state: RootState) => state.auth.authorizationStatus) === AuthorizationStatus.Auth;

  if (isAuth) {
    return <Navigate to={AppRoute.Root} replace />;
  }

  return (
    <Hero/>
  )
}
