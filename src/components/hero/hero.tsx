import { useDispatch } from "react-redux";
import { setLoginFormOpened, setRegisterFormOpened } from "../../store/action";

export function Hero(): JSX.Element {
  const dispatch = useDispatch();

  return (
    <section className="section hero">
      <div className="hero__wrapper">
        <h1 className="title title--2">Ты - то, что ты ешь!</h1>
        <p>Хочешь есть более осознанно? Отслеживай приемы пищи и тренировки, узнавай о своих привычках и достигай своих целей с Nutrillion.</p>
        <button className="button button--submit" onClick={() => dispatch(setRegisterFormOpened({isOpened: true}))}>Начать</button>
        <button className="button" onClick={() => dispatch(setLoginFormOpened({isOpened: true}))}>Войти</button>
      </div>
    </section>
  )
}
