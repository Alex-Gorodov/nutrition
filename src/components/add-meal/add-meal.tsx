import { useDispatch } from "react-redux"
import { setMealFormOpened } from "../../store/action";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { ChooseMeal } from "../choose-meal/choose-meal";

export function AddMeal(): JSX.Element {
  const dispatch = useDispatch();

  const formRef = useOutsideClick(() => {
    dispatch(setMealFormOpened({ isOpened: false }));
  }) as React.RefObject<HTMLFormElement>;


  return (
    <div>
      <form className="form" method="post" action="#" ref={formRef}>
        <h1 className="title title--2 form__title">Добавить прием пищи</h1>
        <button className="button form__button--close" onClick={() => dispatch(setMealFormOpened({isOpened: false}))}>x</button>
        <ChooseMeal/>
      </form>
    </div>
  )
}
