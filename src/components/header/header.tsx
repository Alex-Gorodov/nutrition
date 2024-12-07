import { useDispatch, useSelector } from "react-redux";
import { useIsMobileOnly } from "../../hooks/useIsMobile";
import { RootState } from "../../store/root-reducer";
import { AppRoute, AuthorizationStatus } from "../../const";
import { logoutAction } from "../../store/api-actions";
import { AppDispatch } from "../../types/state";
import { setActiveMeal, setLoginFormOpened, setRegisterFormOpened } from "../../store/action";
import { useState } from "react"
import cn from 'classnames';
import { Link } from "react-router-dom";
import { HeaderUserItem } from "../header-user-item/header-user-item";
import { ReactComponent as Login } from '../../img/icons/login-icon.svg';
import { ReactComponent as Logout } from '../../img/icons/logout-icon.svg';

export function Header(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const isMobile = useIsMobileOnly();
  const authorizationStatus = useSelector((state: RootState) => state.auth.authorizationStatus);
  const isLoginFormOpened = useSelector((state: RootState) => state.page.isLoginFormOpened)
  const isRegistrationFormOpened = useSelector((state: RootState) => state.page.isRegisterFormOpened);

  const activeMeal = useSelector((state: RootState) => state.page.activeMeal);

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  const handleOpenLoginForm = () => {
    dispatch(setLoginFormOpened({isOpened: !isLoginFormOpened}));
    isRegistrationFormOpened && dispatch(setRegisterFormOpened({isOpened: false}));
  }

  const [isMenuOpened, setMenuOpened] = useState(false);

  const burgerClassName = cn("burger", {
    "burger--opened": isMenuOpened,
  });

  const listClassName = cn("header-nav__list", {
    "header-nav__list-mobile": isMobile,
    "header-nav__list-mobile--opened": isMobile && isMenuOpened,
  })

  const clearScreen = () => {
    activeMeal && dispatch(setActiveMeal({meal: null}));
    setMenuOpened(false);
  }

  return (
    <header className="header">
      {
        isMobile
        &&
        <ul className={listClassName}>
          <li className="header-nav__item">
            <Link className="header-nav__link" to={AppRoute.Root} onClick={() => clearScreen()}>Домой</Link>
          </li>
        </ul>
      }
      <div className="header__container">
        {
          isMobile
          &&
          <button className={`header-nav__toggler ${burgerClassName}`} type="button" onClick={() => setMenuOpened(!isMenuOpened)}>
            <span className="visually-hidden">
              {
                isMenuOpened ? 'close menu' : 'open menu'
              }
            </span>
            <span className="burger__line"></span>
          </button>
        }

        {
          !isMobile
          &&
          <ul className={listClassName}>
            <li className="header-nav__item">
              <Link className="header-nav__link" to={AppRoute.Root} onClick={() => clearScreen()}>Домой</Link>
            </li>
          </ul>
        }
        {
          authorizationStatus === AuthorizationStatus.Auth && <HeaderUserItem/>
        }
        {
          authorizationStatus === AuthorizationStatus.Auth
          ?
          <button className="button" type="button" onClick={handleLogout}><Logout/></button>
          :
          <button className="button" type="button" onClick={handleOpenLoginForm}><Login/></button>
        }
      </div>
    </header>
  );
}
