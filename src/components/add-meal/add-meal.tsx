import { useDispatch, useSelector } from "react-redux"
import { setMealFormOpened } from "../../store/action";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { ChooseMeal } from "../choose-meal/choose-meal";
import { RootState } from "../../store/root-reducer";
import { MealAddingForm } from "../meal-adding-form/meal-adding-form";

export function AddMeal(): JSX.Element {
  const dispatch = useDispatch();

  const formRef = useOutsideClick(() => {
    dispatch(setMealFormOpened({ isOpened: false }));
  }) as React.RefObject<HTMLDivElement>;

  // const isAddMealFormOpened = useSelector((state: RootState) => state.page.isNewMealFormOpened);

  // const isNewMealFormOpened = useSelector((state: RootState) => state.page.isNewMealFormOpened);

  return (
    <div>
      {
        <div className="form" ref={formRef}>
          <h1 className="title title--2 form__title">Добавить прием пищи</h1>
          <button className="button form__button--close" onClick={() => dispatch(setMealFormOpened({isOpened: false}))}>x</button>
          <ChooseMeal isPopup/>
        </div>
      }
    </div>
  )
}
