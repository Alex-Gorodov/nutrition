import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { useState, useEffect } from "react";
import { METActivity, METIntensity, MET_VALUES, TrainingType } from "../../const";

function calculateCalories(met: number, weight: number, time: number): number {
  return met * weight * (time / 60); // Время переводится в часы
}

export function AddTraining(): JSX.Element {
  const activeTraining = useSelector((state: RootState) => state.page.activeTraining); // Текущая активность
  const user = useSelector((state: RootState) => state.user); // Пользователь

  const [intensity, setIntensity] = useState<METIntensity>("moderate");
  const [weight, setWeight] = useState(user.weight || 70); // Значение веса по умолчанию
  const [time, setTime] = useState(30); // Продолжительность тренировки
  const [calories, setCalories] = useState(0);

  // Обновление интенсивности и пересчёт калорий при смене активности
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
          // Используйте данные интенсивности (например, скорость и MET)
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

  return (
    <div>
      <h1>Add Training</h1>
      <form>
        {/* Тип активности */}
        <label>
          Activity:
          <select
            value={activeTraining || TrainingType.Walking}
            disabled // Тип активности задаётся извне, выбор здесь недоступен
          >
            {Object.keys(MET_VALUES).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>

        {/* Интенсивность */}
        <label>
          Intensity:
          <select
            value={intensity}
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
        <label>
          Weight (kg):
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
          />
        </label>

        {/* Время */}
        <label>
          Time (minutes):
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
          />
        </label>

        <button type="button" onClick={handleCalculate}>
          Calculate Calories
        </button>
      </form>

      {/* Результат */}
      {calories > 0 && (
        <p>
          You burned approximately <strong>{calories.toFixed(2)}</strong>{" "}
          calories!
        </p>
      )}
    </div>
  );
}
