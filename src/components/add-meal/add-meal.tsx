import { useDispatch } from "react-redux"
import { setMealFormOpened } from "../../store/action";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { ChooseMeal } from "../choose-meal/choose-meal";

export function AddMeal(): JSX.Element {
  const dispatch = useDispatch();

  const formRef = useOutsideClick(() => {
    dispatch(setMealFormOpened({ isOpened: false }));
  }) as React.RefObject<HTMLDivElement>;

  return (
    <div className="form__wrapper">
      <div className="form form--add-meal" ref={formRef}>
        <ChooseMeal isPopup/>
      </div>
    </div>
  )
}
