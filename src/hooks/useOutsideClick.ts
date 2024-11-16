import { useEffect, useRef } from "react";

export const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLUListElement | HTMLFormElement | HTMLDivElement | HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const isFalseTrigger =
        target.closest('button')?.classList.contains('header__burger') ||
        target.closest('div')?.classList.contains('header__burger') ||
        target.closest('button')?.classList.contains('header__burger') ||
        target.closest('button')?.classList.contains('header__button') ||
        target.closest('button')?.classList.contains('user-navigation__button') ||
        target.closest('li')?.classList.contains('shop__sorting-item');

      if (!isFalseTrigger && ref.current && !ref.current.contains(target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
};
