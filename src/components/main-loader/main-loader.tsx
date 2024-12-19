import { ReactComponent as Icon } from "../../img/icons/loader-logo.svg";
import cn from "classnames";
import { useEffect } from "react";

type MainLoaderProps = {
  isPageLoading: boolean;
  onAnimationEnd: () => void;
};

export function MainLoader({ isPageLoading, onAnimationEnd }: MainLoaderProps): JSX.Element {
  useEffect(() => {
    if (!isPageLoading) {
      const timer = setTimeout(onAnimationEnd, 1000);
      return () => clearTimeout(timer);
    }
  }, [isPageLoading, onAnimationEnd]);

  const loaderClassName = cn('main-loader', {
    'main-loader--disappearing': !isPageLoading,
  })

  const logoClassName = cn("main-loader__icon", {
    "main-loader__icon--disappearing": !isPageLoading,
  });

  return (
    <div className={loaderClassName}>
      <p className={logoClassName}>
        <Icon />
      </p>
    </div>
  );
}
