import { useDispatch } from "react-redux";
import { TrainingType, TrainingTypeTranslations } from "../../const";
import { setActiveTraining } from "../../store/action";

export function ChooseTraining(): JSX.Element {
  const dispatch = useDispatch();

  const handleChooseTraining = (training: TrainingType) => {
    dispatch(setActiveTraining({training}))
  }

  return (
    <section className="trainings">
      <div className="trainings__buttons">
        <h1 className="title title--secondary">Выберите тип тренировки</h1>
        {
          Object.values(TrainingType).map((t) => (
            <button
              className={`button training__button training__button--${t.toLowerCase()}`}
              type="button"
              key={t}
              onClick={() => handleChooseTraining(t)}
            >
              <span>{TrainingTypeTranslations[t]}</span>
            </button>
          ))
        }
      </div>
    </section>
  )
}
