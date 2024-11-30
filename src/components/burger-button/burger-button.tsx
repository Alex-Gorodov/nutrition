import { useState } from "react"
import cn from 'classnames';

export function BurgerButton(): JSX.Element {
  const [isMenuOpened, setMenuOpened] = useState(false);

  const burgerClassName = cn("burger", {
    "burger--opened": isMenuOpened,
  });

  return (
    <button className={`mobile-menu__toggler ${burgerClassName}`} type="button" onClick={() => setMenuOpened(!isMenuOpened)}>
      <span className="visually-hidden">
        {
          isMenuOpened ? 'close menu' : 'open menu'
        }
      </span>
      <span className="burger__line"></span>
    </button>
  )
}
