import { useDispatch, useSelector } from "react-redux";
import { useIsMobile } from "../../hooks/useIsMobile";
import { RootState } from "../../store/root-reducer";
import { AuthorizationStatus } from "../../const";
import { logoutAction } from "../../store/api-actions";
import { AppDispatch } from "../../types/state";
import { useState } from "react";
import { AuthForm } from "../auth-form/auth-form";

export function Header(): JSX.Element {
  const isMobile = useIsMobile();
  const authorizationStatus = useSelector((state: RootState) => state.auth.authorizationStatus);
  const dispatch = useDispatch<AppDispatch>();

  const [isLoginFormOpened, setLoginForm] = useState(false);

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  const handleOpenLoginForm = () => {
    setLoginForm(!isLoginFormOpened)
  }

  return (
    <header className="header">
      {
        isMobile ? <button>menu</button> : <button>desk</button>
      }
      {
        authorizationStatus === AuthorizationStatus.Auth
        ?
        <button onClick={handleLogout}>Logout</button>
        :
        <button onClick={handleOpenLoginForm}>Login</button>
      }
      {
        isLoginFormOpened && <AuthForm/>
      }
    </header>
  );
}
