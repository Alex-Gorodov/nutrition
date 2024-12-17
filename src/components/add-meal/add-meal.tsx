import { useDispatch } from "react-redux"
import { setMealFormOpened } from "../../store/action";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { ChooseMeal } from "../choose-meal/choose-meal";
import { ReactComponent as Close } from '../../img/icons/cross-icon.svg';

export function AddMeal(): JSX.Element {
  const dispatch = useDispatch();

  const formRef = useOutsideClick(() => {
    dispatch(setMealFormOpened({ isOpened: false }));
  }) as React.RefObject<HTMLDivElement>;

  return (
    <div className="form form--add-meal" ref={formRef}>
      <button className="button form__button--close" onClick={() => dispatch(setMealFormOpened({isOpened: false}))}><Close/></button>
      <ChooseMeal isPopup/>
    </div>
  )
}
