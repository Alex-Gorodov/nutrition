import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { useState, useEffect } from "react";
import { ErrorMessages, METActivity, METIntensity, MET_VALUES, SuccessMessages, TrainingType, TrainingTypeTranslations } from "../../const";
import { setActiveTraining, setStatusMessage, setTrainingFormOpened, trackUserTrainingSession } from "../../store/action";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { addTrainingSessionToUser } from "../../store/api-actions";
import { ReactComponent as Close } from '../../img/icons/cross-icon.svg';

function calculateCalories(met: number, weight: number, time: number): number {
  return met * weight * (time / 60);
}

export function AddTraining(): JSX.Element {
  const dispatch = useDispatch();
  const activeTraining = useSelector((state: RootState) => state.page.activeTraining);
  const activeUser = useSelector((state: RootState) => state.user);
  const userWeight = useSelector((state: RootState) => state.data.users.find((u) => u.id === activeUser.id))?.weight;

  const user = useSelector((state: RootState) => state.data.users.find((u) => u.id === activeUser.id));


  const [intensity, setIntensity] = useState("moderate");
  const [weight, setWeight] = useState(userWeight || 70);
  const [time, setTime] = useState(30);
  const [calories, setCalories] = useState(0);

  const formRef = useOutsideClick(() => {
    dispatch(setTrainingFormOpened({ isOpened: false }));
  }) as React.RefObject<HTMLFormElement>;

  useEffect(() => {
    if (activeTraining && activeTraining in MET_VALUES) {
      setIntensity("moderate");
    }
  }, [activeTraining]);

  useEffect(() => {
    if (!activeTraining || !(activeTraining in MET_VALUES)) {
      console.error(`Invalid active training type: ${activeTraining}`);
    } else if (activeTraining in MET_VALUES) {
      const activityData = MET_VALUES[activeTraining as METActivity];
      if (activityData && intensity in activityData) {
        const intensityData = activityData[intensity as keyof typeof activityData];
        if (!intensityData) {
          console.error(`Invalid intensity: ${intensity} for activity ${activeTraining}`);
        } else {
          const { met } = intensityData;
          const result = calculateCalories(met, weight, time);
          setCalories(result);
        }
      } else {
        console.error(`Invalid intensity: ${intensity} for activity ${activeTraining}`);
      }

    }
  }, [activeTraining, intensity, time, weight]);

  const handleCalculate = () => {
    if (!activeTraining || !(activeTraining in MET_VALUES)) {
      console.error(`No MET data found for activity: ${activeTraining}`);
      return;
    }

    const activityData = MET_VALUES[activeTraining as METActivity];
    const intensityData = activityData[intensity as keyof typeof activityData];
    if (!intensityData) {
      console.error(`No data found for intensity: ${intensity}`);
      return;
    }

    const { met } = intensityData;
    const result = calculateCalories(met, weight, time);
    setCalories(result);
  };

  const handleChangeTrainingType = (key: string) => {
    dispatch(setActiveTraining({training: key as TrainingType}))
    handleCalculate();
  }

  const handleAddTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    const training = {
      activity: activeTraining || TrainingType.Walking,
      date: new Date(),
      duration: time,
      caloriesBurned: calories,
      id: `${user?.name}-${activeTraining}-${user?.trainingSessions?.length ? user?.trainingSessions.length : '0'}`
    };
    try {
      addTrainingSessionToUser(
        activeUser,
        training
      );
      dispatch(trackUserTrainingSession({user: activeUser, session: training}));
      user
        ?
        dispatch(setStatusMessage({message: SuccessMessages.TrainingAdded}))
        :
        dispatch(setStatusMessage({message: ErrorMessages.TrainingNoAuthError}))
      } catch(e) {
        dispatch(setStatusMessage({message: ErrorMessages.ConnectionError}))
        console.error('error!', e);
      } finally {
        setTrainingFormOpened({isOpened: false})
      }
  }

  return (
    <div className="form__wrapper">
      <form className="form" method="post" ref={formRef}>
        <div className="form__header">
          <h1 className="title title--2 form__title">Добавить тренировку</h1>
          <button className="button form__button--close" onClick={() => dispatch(setTrainingFormOpened({isOpened: false}))}><Close/></button>
        </div>
        <fieldset className="form__fieldset">
        <label className="form__item form__item--row" htmlFor="training-type">
          Активность:
            <select
              className="form__input form__input--select"
              value={activeTraining || ''}
              id="training-type"
              onChange={(e) => handleChangeTrainingType(e.target.value)}
            >
              {Object.keys(MET_VALUES).map((key) => (
                <option key={key} value={key}>
                  {TrainingTypeTranslations[key as keyof typeof TrainingType]}
                </option>
              ))}
            </select>
          </label>


          <label className="form__item" htmlFor="training-intensity">
            Интенсивность:
            <select
              className="form__input form__input--select"
              value={intensity}
              id="training-intensity"
              onChange={(e) => setIntensity(e.target.value as METIntensity)}
            >
              {Object.keys(MET_VALUES[activeTraining as METActivity] || {}).map((key) => {
                const intensityValue = MET_VALUES[activeTraining as METActivity][key as keyof typeof MET_VALUES[METActivity]];
                return (
                  <option key={key} value={key}>
                    {intensityValue.intensity}
                  </option>
                );
              })}
            </select>
          </label>


          <label className="form__item" htmlFor="training-weight">
            Вес (кг):
            <input
              className="form__input"
              type="number"
              id="training-weight"
              value={weight || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setWeight(Number(null));
                } else {
                  setWeight(Number(value));
                }
              }}
            />
          </label>

          <label className="form__item" htmlFor="training-time">
            Время (в минутах):
            <input
              className="form__input"
              type="number"
              id="training-time"
              value={time || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setTime(Number(null));
                } else {
                  setTime(Number(value));
                }
              }}
            />
          </label>

          {calories > 0 && (
            <p>
              Ты затратил примерно <strong>{Math.floor(calories)}</strong>{" "}
              калорий! Так держать!
            </p>
          )}
        </fieldset>

        <button className="button button--submit form__submit" type="submit" onClick={handleAddTraining}>Записать тренировку!</button>
      </form>
    </div>
  );
}
