import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { AppRoute, MealType, MealTypeTranslations } from "../../const";
import { MealItem } from "../meal-item/meal-item";
import { redirectToRoute, setActiveMeal, setActiveMealType, setMealFormOpened, setNewMealFormOpened } from "../../store/action";
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
      dispatch(setMealFormOpened({isOpened: false}));
    }
  }, [activeMealType, dispatch]);

  const handleOpenForm = () => {
    dispatch(setMealFormOpened({isOpened: false}));
    dispatch(setActiveMeal({meal: null}));
    dispatch(setActiveMealType({type: null}));
    dispatch(setNewMealFormOpened({isOpened: true}));
  }

  const className = cn('section meals', {
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
        <h1 className="title title--secondary meals__title">Выбери прием пищи</h1>
        <div className="meals__buttons">
          {Object.values(MealType).map((type) => (
            <button
              className={`button meal__button`}
              type="button"
              key={type}
              onClick={() => handleSetActiveMealType(type)}
            >
              <span>{MealTypeTranslations[type]}</span>
            </button>
          ))}
        </div>
        <h2 className="title title--secondary meals__title">Или добавь новое блюдо</h2>
        <button className="button meal__button meal__button--add-new-meal" onClick={() => handleOpenForm()}>+</button>
      </>
      )}
    </section>
  );
}
