import { useDispatch } from "react-redux";
import { TrainingType, TrainingTypeTranslations } from "../../const";
import { setActiveTraining, setTrainingFormOpened } from "../../store/action";

export function ChooseTraining(): JSX.Element {
  const dispatch = useDispatch();

  const handleChooseTraining = (training: TrainingType) => {
    training !== null && dispatch(setTrainingFormOpened({isOpened: true}));
    dispatch(setActiveTraining({training}));
  }

  return (
    <section className="choose-training">
      <div className="choose-training__container">
        <h1 className="title title--secondary choose-training__title">Выберите тип тренировки</h1>
        <div className="choose-training__buttons">
          {
            Object.values(TrainingType).map((t) => (
              <button
                className={`button choose-training__button choose-training__button--${t.toLowerCase()}`}
                type="button"
                key={t}
                onClick={() => handleChooseTraining(t)}
              >
                <span>{TrainingTypeTranslations[t]}</span>
              </button>
            ))
          }
        </div>
      </div>
    </section>
  )
}
