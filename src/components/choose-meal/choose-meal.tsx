import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { AppRoute, MealType, MealTypeTranslations } from "../../const";
import { MealItem } from "../meal-item/meal-item";
import { redirectToRoute, setActiveMealType, setMealFormOpened, setNewMealFormOpened } from "../../store/action";
import cn from 'classnames';
import { generatePath } from "react-router-dom";
import { useEffect } from "react";

type ChooseMealProps = {
  isPopup?: boolean;
}

export function ChooseMeal({isPopup}: ChooseMealProps): JSX.Element {
  const dispatch = useDispatch();
  const activeMeal = useSelector((state: RootState) => state.page.activeMeal);
  const activeMealType = useSelector((state: RootState) => state.page.activeMealType);

  const handleSetActiveMealType = (type: MealType) => {
    dispatch(setActiveMealType({type}))
  }

  useEffect(() => {
    if (activeMealType) {
      const link = generatePath(AppRoute.MealsByTypePage, { type: `${activeMealType}` });
      dispatch(redirectToRoute(link as AppRoute));
    }
  }, [activeMealType, dispatch]);

  const handleOpenForm = () => {
    dispatch(setMealFormOpened({isOpened: false}));
    dispatch(setNewMealFormOpened({isOpened: true}));
  }

  const className = cn('meals', {
    'meals--popup': isPopup,
  })

  return (
    <section className={className}>
      {activeMeal ? (
        <MealItem meal={activeMeal}/>
      ) : (
        ''
      )}
      {!activeMeal && (
      <>
        <h1 className="title title--secondary meals__title">Выберите тип приема пищи</h1>
        <div className="meals__buttons">
          {Object.values(MealType).map((type) => (
            <button
              className={`button meal__button meal__button--${type.toLowerCase()}`}
              type="button"
              key={type}
              onClick={() => handleSetActiveMealType(type)}
            >
              <span>{MealTypeTranslations[type]}</span>
            </button>
          ))}
          <button className="button meal__button meal__button--add-new-meal" onClick={() => handleOpenForm()}>+</button>
        </div>
      </>
      )}
    </section>
  );
}