import { useDispatch } from "react-redux";
import { ErrorMessages, SuccessMessages } from "../../const";
import { setStatusMessage } from "../../store/action";

type MessagePopupProps = {
  message: ErrorMessages | SuccessMessages;
}
export function MessagePopup({message}: MessagePopupProps): JSX.Element {

  const dispatch = useDispatch();

  return (
    <div className="popup">
      <p>{message}</p>
      <button className="button popup__button" onClick={() => dispatch(setStatusMessage({message: null}))}>close</button>
    </div>
  )
}
