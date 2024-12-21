import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { RootState } from "../../store/root-reducer";
import { AppRoute, AuthorizationStatus, ScreenSizes } from "../../const";
import { logoutAction } from "../../store/api-actions";
import { AppDispatch } from "../../types/state";
import { redirectToRoute, setActiveMeal, setLoginFormOpened, setRegisterFormOpened } from "../../store/action";
import { useState } from "react"
import cn from 'classnames';
import { Link } from "react-router-dom";
import { HeaderUserItem } from "../header-user-item/header-user-item";
import { ReactComponent as Login } from '../../img/icons/login-icon.svg';
import { ReactComponent as Logout } from '../../img/icons/logout-icon.svg';
import { ReactComponent as Logo } from '../../img/icons/logo-icon-small.svg';

export function Header(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const isMobile = useMediaQuery(ScreenSizes.MobileOnly);
  const authorizationStatus = useSelector((state: RootState) => state.auth.authorizationStatus);
  const isLoginFormOpened = useSelector((state: RootState) => state.page.isLoginFormOpened)
  const isRegistrationFormOpened = useSelector((state: RootState) => state.page.isRegisterFormOpened);

  const activeMeal = useSelector((state: RootState) => state.page.activeMeal);
  // const activeMealType = useSelector((state: RootState) => state.page.activeMealType);

  const handleLogout = () => {
    dispatch(logoutAction());
    dispatch(redirectToRoute(AppRoute.Landing))
  };

  const handleOpenLoginForm = () => {
    dispatch(setLoginFormOpened({isOpened: !isLoginFormOpened}));
    isRegistrationFormOpened && dispatch(setRegisterFormOpened({isOpened: false}));
  }

  const [isMenuOpened, setMenuOpened] = useState(false);

  // const burgerClassName = cn("burger", {
  //   "burger--opened": isMenuOpened,
  // });

  const listClassName = cn("header-nav__list", {
    "header-nav__list-mobile": isMobile,
    "header-nav__list-mobile--opened": isMobile && isMenuOpened,
  })

  const clearScreen = () => {
    activeMeal && dispatch(setActiveMeal({meal: null}));
    // activeMealType && dispatch(setActiveMealType({type: null}))
    setMenuOpened(false);
  }

  return (
    <header className="header">
      {/* {
        isMobile
        &&
        <ul className={listClassName}>
          <li className="header-nav__item">
            <Link className="header-nav__link" to={AppRoute.Root} onClick={() => clearScreen()}>Домой</Link>
          </li>
        </ul>
      } */}
      <div className="header__container">
        {/* {
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
        } */}

        {
          // !isMobile
          // &&
          <ul className={listClassName}>
            <li className="header-nav__item">
              <Link className="header-nav__link header-nav__link--black" to={AppRoute.Root} onClick={() => clearScreen()}><Logo/></Link>
            </li>
          </ul>
        }
        {
          authorizationStatus === AuthorizationStatus.Auth && <HeaderUserItem/>
        }
        {
          authorizationStatus === AuthorizationStatus.Auth
          ?
          <button className="header-nav__button header-nav__item" type="button" onClick={handleLogout}><Logout/></button>
          :
          <button className="header-nav__button header-nav__item" type="button" onClick={handleOpenLoginForm}><Login/></button>
        }
      </div>
    </header>
  );
}
