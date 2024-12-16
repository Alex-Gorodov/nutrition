import { useDispatch } from "react-redux";
import { ErrorMessages, SuccessMessages } from "../../const";
import { setLoginFormOpened, setMealFormOpened, setNewMealFormOpened, setRegisterFormOpened, setStatusMessage, setTrainingFormOpened } from "../../store/action";
import { useEffect } from "react";

type MessagePopupProps = {
  message: ErrorMessages | SuccessMessages;
}
export function MessagePopup({message}: MessagePopupProps): JSX.Element {

  const dispatch = useDispatch();

  const isOpened = false;

  useEffect(() => {
    message &&
      dispatch(setMealFormOpened({isOpened}));
      dispatch(setTrainingFormOpened({isOpened}));
      dispatch(setRegisterFormOpened({isOpened}));
      dispatch(setLoginFormOpened({isOpened}));
      dispatch(setNewMealFormOpened({isOpened}));
  })

  return (
    <div className="popup">
      <p>{message}</p>
      <button className="button popup__button" onClick={() => dispatch(setStatusMessage({message: null}))}>close</button>
    </div>
  )
}
