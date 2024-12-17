import { useDispatch } from "react-redux";
import { ErrorMessages, SuccessMessages } from "../../const";
import { setLoginFormOpened, setMealFormOpened, setNewMealFormOpened, setRegisterFormOpened, setStatusMessage, setTrainingFormOpened } from "../../store/action";
import { useEffect } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";

type MessagePopupProps = {
  message: ErrorMessages | SuccessMessages;
}
export function MessagePopup({message}: MessagePopupProps): JSX.Element {

  const dispatch = useDispatch();

  const isOpened = false;

  const ref = useOutsideClick(() => {
    dispatch(setStatusMessage({message: null}))
  }) as React.RefObject<HTMLDivElement>

  useEffect(() => {
    message &&
      dispatch(setMealFormOpened({isOpened}));
      dispatch(setTrainingFormOpened({isOpened}));
      dispatch(setRegisterFormOpened({isOpened}));
      dispatch(setLoginFormOpened({isOpened}));
      dispatch(setNewMealFormOpened({isOpened}));
  })

  return (
    <div className="popup" ref={ref}>
      <p className="popup__message">{message}</p>
      <button className="button button--submit" onClick={() => dispatch(setStatusMessage({message: null}))}>Закрыть</button>
    </div>
  )
}
