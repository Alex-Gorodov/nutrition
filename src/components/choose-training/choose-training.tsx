import { useDispatch } from "react-redux";
import { TrainingType, TrainingTypeTranslations } from "../../const";
import { setActiveTraining, setTrainingFormOpened } from "../../store/action";
import { ReactComponent as Walking } from '../../img/icons/walking-icon.svg';
import { ReactComponent as Running } from '../../img/icons/running-icon.svg';
import { ReactComponent as Cardio } from '../../img/icons/cardio-icon.svg';
import { ReactComponent as Gym } from '../../img/icons/gym-icon.svg';
import { ReactComponent as Swimming } from '../../img/icons/swimming-icon.svg';

const TrainingIcons = {
  Walking: Walking,
  Running: Running,
  Cardio: Cardio,
  Gym: Gym,
  Swimming: Swimming,
};

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
            Object.values(TrainingType).map((t) => {
              const TrainingComponent = TrainingIcons[t as keyof typeof TrainingIcons];

              return (
                <button
                  className={`button choose-training__button choose-training__button--${t.toLowerCase()}`}
                  type="button"
                  key={t}
                  onClick={() => handleChooseTraining(t)}
                >
                  <span>{TrainingTypeTranslations[t]}</span>
                  {TrainingComponent && <TrainingComponent />}
                </button>
              )})
          }
        </div>
      </div>
    </section>
  )
}
