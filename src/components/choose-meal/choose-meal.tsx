import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { MealType, MealTypeTranslations } from "../../const";
import { MealItem } from "../meal-item/meal-item";
import { useSetActiveMeal } from "../../hooks/useSetActiveMeal";
import { setNewMealFormOpened } from "../../store/action";

export function ChooseMeal(): JSX.Element {
  const dispatch = useDispatch();
  const activeMeal = useSelector((state: RootState) => state.page.activeMeal);
  const isAddMealFormOpened = useSelector((state: RootState) => state.page.isNewMealFormOpened);

  const handleSetActiveMeal = useSetActiveMeal();
  const handleOpenForm = () => {
    dispatch(setNewMealFormOpened({isOpened: !isAddMealFormOpened}));
  }

  return (
    <section className="meals">
      <div className="meal">
        {activeMeal ? (
          <MealItem meal={activeMeal}/>
        ) : (
          ''
        )}
      </div>

      {!activeMeal && (
    <>
      <h1 className="title title--secondary meals__title">Выберите тип приема пищи</h1>
      <div className="meals__buttons">
        {Object.values(MealType).map((type) => (
          <button
            className={`button meal__button meal__button--${type.toLowerCase()}`}
            type="button"
            key={type}
            onClick={() => handleSetActiveMeal(type)}
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
