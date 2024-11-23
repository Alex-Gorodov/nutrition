import { useDispatch, useSelector } from "react-redux";
import { useIsMobile } from "../../hooks/useIsMobile";
import { RootState } from "../../store/root-reducer";
import { AuthorizationStatus } from "../../const";
import { logoutAction } from "../../store/api-actions";
import { AppDispatch } from "../../types/state";

export function Header(): JSX.Element {
  const isMobile = useIsMobile();
  const authorizationStatus = useSelector((state: RootState) => state.auth.authorizationStatus);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  return (
    <header className="header">
      {
        isMobile ? <button>menu</button> : <button>desk</button>
      }
      {
        authorizationStatus === AuthorizationStatus.Auth
        ?
        <button onClick={handleLogout}>Logout</button>
        : 'no authed'
      }
    </header>
  );
}
