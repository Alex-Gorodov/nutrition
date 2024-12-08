import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { useState, useEffect } from "react";
import { ErrorMessages, METActivity, METIntensity, MET_VALUES, SuccessMessages, TrainingType } from "../../const";
import { setActiveTraining, setStatusMessage, setTrainingFormOpened } from "../../store/action";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { addTrainingSessionToUser } from "../../store/api-actions";

function calculateCalories(met: number, weight: number, time: number): number {
  return met * weight * (time / 60); // Время переводится в часы
}

export function AddTraining(): JSX.Element {
  const dispatch = useDispatch();
  const activeTraining = useSelector((state: RootState) => state.page.activeTraining);
  const user = useSelector((state: RootState) => state.user);
  const userWeight = useSelector((state: RootState) => state.data.users.find((u) => u.id === user.id))?.weight;
  const isFormOpened = useSelector((state: RootState) => state.page.isTrainingFormOpened);

  const formRef = useOutsideClick(() => {
    dispatch(setTrainingFormOpened({ isOpened: false }));
  }) as React.RefObject<HTMLFormElement>;


  const [intensity, setIntensity] = useState<METIntensity>("moderate");
  const [weight, setWeight] = useState(userWeight || 70);
  const [time, setTime] = useState(30);
  const [calories, setCalories] = useState(0);
  const [isChoosingLocked, setIsChoosingLocked] = useState(true);

  console.log('w', userWeight);

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
    try {
      addTrainingSessionToUser(
        user,
        {
          activity: activeTraining || TrainingType.Walking,
          date: new Date(),
          duration: time,
          caloriesBurned: calories
        },
        dispatch
      );
      user
        ?
        dispatch(setStatusMessage({message: SuccessMessages.TrainingAdded}))
        :
        dispatch(setStatusMessage({message: ErrorMessages.TrainingNoAuthError}))
      setTrainingFormOpened({isOpened: false})
    } catch(e) {
      dispatch(setStatusMessage({message: ErrorMessages.ConnectionError}))
      console.error('error!', e);
    }

  }

  return (
    <div>
      <form className="form" method="post" ref={formRef}>
        <h1 className="title title--2 form__title">Add Training</h1>
        <button className="button form__button--close" onClick={() => dispatch(setTrainingFormOpened({isOpened: !isFormOpened}))}>x</button>
        <fieldset className="form__fieldset">
          <label className="form__item form__item--row" htmlFor="training-type">
            Activity:
            <div>
              <select
                className="form__input form__input--select"
                value={activeTraining || ''}
                disabled={isChoosingLocked}
                id="training-type"
                onChange={(e) => handleChangeTrainingType(e.target.value)}
              >
                {Object.keys(MET_VALUES).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
              <button className="button" type="button" onClick={() => setIsChoosingLocked(!isChoosingLocked)}>{isChoosingLocked ? 'unlock' : 'lock'}</button>
            </div>
          </label>

          {/* Интенсивность */}
          <label className="form__item" htmlFor="training-intensity">
            Intensity:
            <select
              className="form__input form__input--select"
              value={intensity}
              id="training-intensity"
              onChange={(e) => setIntensity(e.target.value as METIntensity)}
            >
              {Object.keys(MET_VALUES[activeTraining as METActivity] || {}).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </label>

          {/* Вес */}
          <label className="form__item" htmlFor="training-weight">
            Weight (kg):
            <input
              className="form__input"
              type="number"
              id="training-weight"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </label>

          {/* Время */}
          <label className="form__item" htmlFor="training-time">
            Time (minutes):
            <input
              className="form__input"
              type="number"
              id="training-time"
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
            />
          </label>
        </fieldset>

        <button className="button" type="button" onClick={handleCalculate}>
          Calculate Calories
        </button>
        {/* Результат */}
        {calories > 0 && (
          <p>
            You burned approximately <strong>{Math.floor(calories)}</strong>{" "}
            calories!
          </p>
        )}
        <button className="button button--submit" type="submit" onClick={handleAddTraining}>Записать тренировку!</button>
      </form>

    </div>
  );
}
