import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { AppRoute, MealType, MealTypeTranslations } from "../../const";
import { MealItem } from "../meal-item/meal-item";
import { setMealFormOpened, setNewMealFormOpened } from "../../store/action";
import cn from 'classnames';
import { generatePath, useNavigate } from "react-router-dom";
import { ReactComponent as Close } from '../../img/icons/cross-icon.svg';
import { useEffect, useState } from "react";
import { Meal } from "../../types/meal";

type ChooseMealProps = {
  isPopup?: boolean;
}

export function ChooseMeal({isPopup}: ChooseMealProps): JSX.Element {
  const dispatch = useDispatch();
  const activeMeal = useSelector((state: RootState) => state.page.activeMeal);

  const isMealFormOpened = useSelector((state: RootState) => state.page.isMealFormOpened);

  const navigate = useNavigate();

  const [localActiveMealType, setLocalActiveMealType] = useState<MealType | null>(null);

  useEffect(() => {
    if (localActiveMealType) {
      const link = generatePath(AppRoute.MealsByTypePage, { type: `${localActiveMealType}` });
      navigate(link as AppRoute);
      isMealFormOpened && dispatch(setMealFormOpened({ isOpened: false }));
    }
  }, [localActiveMealType, navigate, isMealFormOpened, dispatch]);

  const handleSetActiveMealType = (type: MealType) => {
    setLocalActiveMealType(type);
  };


  const handleOpenForm = () => {
    isMealFormOpened && dispatch(setMealFormOpened({isOpened: false}));
    dispatch(setNewMealFormOpened({isOpened: true}));
  }

  const className = cn('meals', {
    'meals--popup': isPopup,
  })

  return (
    <div className={className}>
      {activeMeal ? (
        <MealItem meal={activeMeal as Meal}/>
      ) : (
        ''
      )}
      {!activeMeal && (
      <>
        {
          isPopup
          ?
          <div className="form__header">
            <h1 className="title title--secondary meals__title">Выбери прием пищи</h1>
            <button className="button form__button--close" onClick={() => dispatch(setMealFormOpened({isOpened: false}))}><Close/></button>
          </div>
          :
          <h1 className="title title--secondary meals__title">Выбери прием пищи</h1>

        }
        <div className="meals__wrapper">
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
        </div>
      </>
      )}
    </div>
  );
}
