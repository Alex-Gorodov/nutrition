import { useEffect, useState } from "react";
import { ActivityLevelTranslations, AppRoute, CaloricGoals, CaloricValues, MacronutrientRatios, MealTypeTranslations, NutritionTarget, NutritionTargetToCaloricGoals, TrainingTypeTranslations } from "../../const";
import { User } from "../../types/user";
import { setUserGreetings } from "../../utils/setUserGreetings";
import { useDispatch } from "react-redux";
import { updateUserTarget, updateUserWeight } from "../../store/api-actions";
import { ReactComponent as EditIcon } from "../../img/icons/edit-icon.svg";
import { ReactComponent as ApplyIcon } from "../../img/icons/apply-icon.svg";
import { ReactComponent as AddIcon } from "../../img/icons/add-icon.svg";
import { formatDate } from "../../utils/formatDate";
import { setActiveMeal, setMealFormOpened, setTrainingFormOpened, setUserTarget, setUserWeight } from "../../store/action";
import { getBasalMetabolicRate } from "../../utils/getBasalMetabolicRate";
import { groupByDate } from "../../utils/groupByDate";
import { ReactComponent as CollapseIcon } from "../../img/icons/down-icon.svg"
import { RadialProgressBar } from "../radial-progress-bar/radial-progress-bar";
import { generatePath, Link } from "react-router-dom";

type UserItemProps = {
  user: User;
}

export function UserItem({ user }: UserItemProps): JSX.Element {
  const dispatch = useDispatch();
  const [isWeightEditable, setWeightEditable] = useState(false);
  const [isTargetEditable, setTargetEditable] = useState(false);
  const [weight, setWeight] = useState(user.weight);
  const [target, setTarget] = useState(user.target);

  const [trainingExpandedDates, setTrainingExpandedDates] = useState<Record<string, boolean>>({});
  const [mealsExpandedDates, setMealsExpandedDates] = useState<Record<string, boolean>>({});

  const toggleTrainingDate = (date: string) => {
    setTrainingExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const toggleMealsDate = (date: string) => {
    setMealsExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  useEffect(() => {
    const todayFormatted = formatDate(new Date());
    setTrainingExpandedDates((prev) => ({
      ...prev,
      [todayFormatted]: true,
    }));
    setMealsExpandedDates((prev) => ({
      ...prev,
      [todayFormatted]: true,
    }));
  }, []);


  const calculateActiveBmr = (
    bmr: number,
    activityLevel: number,
    nutritionTarget: NutritionTarget
  ): number => {
    const caloricGoalKey = NutritionTargetToCaloricGoals[nutritionTarget]; // Получение ключа
    const caloricGoal = CaloricGoals[caloricGoalKey]; // Получение значения
    return Math.floor(bmr * activityLevel * caloricGoal); // Расчёт
  };

  const today = new Date().getDate();

  const handleEditWeight = async () => {
    dispatch(setUserWeight({ user, newWeight: weight }));
    setWeightEditable(false);
    try {
      await updateUserWeight(user, weight, dispatch);
      console.log("Weight updated successfully");
    } catch (error) {
      console.error("Failed to update weight", error);
    }
  };

  useEffect(() => {
    setWeight(user.weight);
  }, [user.weight]);

  const handleEditTarget = async () => {
    dispatch(setUserTarget({ user, newTarget: target }));
    setTargetEditable(false);
    try {
      await updateUserTarget(user, target, dispatch);
      console.log('Target updated successfully');
    } catch (error) {
      console.error('Failed to update target:', error);
    }
  };

  useEffect(() => {
    setTarget(user.target);
  }, [user.target]);

  const todayMeals = user.mealSchedule && user.mealSchedule.filter((m) => new Date(m[1]).getDate() === today)

  const bmr = getBasalMetabolicRate(user).valueOf();

  const caloriesTarget = calculateActiveBmr(bmr, user.activityLevel, user.target);

  // Получаем соотношение БЖУ для выбранной цели
  const { proteins: proteinRatio, fats: fatRatio, carbs: carbRatio } = MacronutrientRatios[user.target];

  // Общая цель по калориям
  const caloricGoal = CaloricGoals[NutritionTargetToCaloricGoals[user.target]];
  const totalCalorieTarget = Math.round(caloriesTarget * caloricGoal);

  // Рассчитываем цель по БЖУ
  const proteinsTarget = Math.round((totalCalorieTarget * proteinRatio) / CaloricValues.Proteins);
  const fatsTarget = Math.round((totalCalorieTarget * fatRatio) / CaloricValues.Fats);
  const carbsTarget = Math.round((totalCalorieTarget * carbRatio) / CaloricValues.Carbs);


  let calories = 0;
  let proteins = 0;
  let fats = 0;
  let carbs = 0;
  todayMeals && todayMeals.forEach((m) => {
    calories += m[0].calories
    proteins += m[0].proteins
    fats += m[0].fats
    carbs += m[0].carbs
  })


  // const link = generatePath(AppRoute.MealPage, { id: meal.id });
  // dispatch(redirectToRoute(link as AppRoute));

  return (
    <div className="user">
      <div className="user__wrapper">
        <div className="user__info">
          <p className="user__name">{setUserGreetings(user.name)}</p>
          <p>Ваш базовый обмен веществ: <b>{bmr}</b> ккал в день.*</p>
          <p>Учитывая ваш уровень физической нагрузки ({ActivityLevelTranslations[user.activityLevel].toLowerCase()}) и вашу цель ({user.target.toLowerCase()}), вам необходимо получать из пищи <b>{caloriesTarget}</b> ккал.</p>
          <div className="user__targets">
            <p className="title title--3 user__title">За сегодня вы употребили: </p>
            <RadialProgressBar target={caloriesTarget} value={calories} field="калорий"/>
            <RadialProgressBar target={proteinsTarget} value={proteins} field="белков"/>
            <RadialProgressBar target={fatsTarget} value={fats} field="жиров"/>
            <RadialProgressBar target={carbsTarget} value={carbs} field="углеводов"/>
          </div>
          <p className="user__editable-wrapper">
            <span className="user__editable-title">Ваш вес:</span>
            {
              isWeightEditable
                ?
                <label className="user__editable-weight" htmlFor="user-edit-weight">
                  <input className="user__editable-info user__editable-info--on" autoFocus={isWeightEditable} type="number" id="user-edit-weight" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
                </label>
                :
                <span className="user__editable-info">{user.weight}</span>
            }
            <button
              className="button button--icon"
              type="button"
              onClick={() => {
                if (isWeightEditable) {
                  handleEditWeight();
                } else {
                  setWeightEditable(true);
                }
              }}
            >
              {
                isWeightEditable
                  ?
                  <ApplyIcon />
                  :
                  <EditIcon />
              }
              <span className="visually-hidden">{
                isWeightEditable
                  ?
                  'apply'
                  :
                  'edit'
              }</span>
            </button>
          </p>
          <p className="user__editable-wrapper">
            <span className="user__editable-title">Ваша цель:</span>
            {
              isTargetEditable
                ?
                <select className="user__editable-info user__editable-info--select user__editable-info--on" name="user-change-target" id="user-change-target" value={target}
                  onChange={(e) => {
                    const newTarget = e.target.value as NutritionTarget;
                    setTarget(newTarget);
                  }}
                >
                  {
                    Object.values(NutritionTarget).map((i) => (
                      <option value={i} key={`${user.name}-target-${i}`}>{i}</option>
                    ))
                  }
                </select>
                :
                <span className="user__editable-info">{user.target || NutritionTarget.WeightMaintenance}</span>
            }
            <button
              className="button button--icon"
              type="button"
              onClick={() => {
                if (isTargetEditable) {
                  handleEditTarget();
                } else {
                  setTargetEditable(true);
                }
              }}
            >
              {
                isTargetEditable
                  ?
                  <ApplyIcon />
                  :
                  <EditIcon />
              }
              <span className="visually-hidden">{
                isTargetEditable
                  ?
                  'apply'
                  :
                  'edit'
              }</span>
            </button>
          </p>
        </div>
      </div>
      {user.trainingSessions && user.trainingSessions.length > 0 && (
        <div className="user__trainings user-actions">
          <div className="user-actions__title-wrapper">
            <h3 className="user-actions__title title title--3">Тренировки</h3>
            <button
              className="button button--reset user-actions__add-btn"
              onClick={() => dispatch(setTrainingFormOpened({ isOpened: true }))}
            >
              <AddIcon />
            </button>
          </div>
          <div className="user-actions__table">
            <div className="user-actions__head">
              <span>Активность</span>
              <span>Сожжено калорий</span>
              <span>Дата</span>
            </div>
            <ul className="user-actions__list">
              {Object.entries(groupByDate(user.trainingSessions, (t) => formatDate(new Date(t.date)))).map(
                ([date, sessions]) =>
                  <li key={`training-group-${date}`}>
                    {
                      !trainingExpandedDates[date]
                        ?
                        <div
                          className="user-actions__group-header"
                        >
                          <div onClick={() => toggleTrainingDate(date)}>
                            <p>{date}</p>
                            <CollapseIcon className="icon" />
                          </div>
                        </div>
                        :
                        <div
                          className="user-actions__group-header"
                        >
                          <div onClick={() => toggleTrainingDate(date)}>
                            <p>{date}</p>
                            <CollapseIcon className="icon icon--rotated" />
                          </div>
                          <ul className="user-actions__sublist">
                            {sessions.map((t) => (
                              <li
                                className="user-actions__item user-actions__item--trainings"
                                key={`${user.name}-training-${t.activity}-${t.duration}-${new Date(t.date).getDay()}`}
                              >
                                <span>{TrainingTypeTranslations[t.activity]}</span>
                                <span>{Math.floor(t.caloriesBurned)}</span>
                                <span>{date}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                    }
                  </li>
              )
              }
            </ul>
          </div>
        </div>
      )}
      {
        user.mealSchedule && user.mealSchedule.length > 0 &&
        <div className="user__meals user-actions">
          <div className="user-actions__title-wrapper">
            <h3 className="user-actions__title title title--3">Приемы пищи</h3>
            <button className="button button--reset user-actions__add-btn" onClick={() => dispatch(setMealFormOpened({ isOpened: true }))}><AddIcon /></button>
          </div>
          <div className="user-actions__table">
            <div className="user-actions__head">
              <span>Прием пищи</span>
              <span>Название блюда</span>
              <span>Получено калорий</span>
              <span>Дата</span>
            </div>
            <ul className="user-actions__list">
              {
                Object.entries(groupByDate(user.mealSchedule, (m) => formatDate(m[1]))).map(
                  ([date, schedule]) =>
                    <li key={`${schedule[0][0].name}-${schedule[0]}-${date}`}>
                      {
                        !mealsExpandedDates[date]
                          ?
                          <div
                            className="user-actions__group-header"
                          >
                            <div onClick={() => toggleMealsDate(date)}>
                              <p>{date}</p>
                              <CollapseIcon className="icon" />
                            </div>
                          </div>
                          :
                          <div
                            className="user-actions__group-header"
                          >
                            <div onClick={() => toggleMealsDate(date)}>
                              <p>{date}</p>
                              <CollapseIcon className="icon icon--rotated" />
                            </div>
                            <ul className="user-actions__sublist">
                              {

                                schedule.map((m, i) => {
                                  const link = generatePath(AppRoute.MealPage, { id: m[0].id });

                                  return (
                                  <li
                                    className={`user-actions__item user-actions__item--meal user-actions__item--${m[0].type.toLowerCase()}`}
                                    key={`${m[0].name}-${m[0]}-${date}-${i}`}
                                  >
                                    <span>{MealTypeTranslations[m[0].type]}</span>
                                    <span>
                                      <Link className="user-actions__item-link" to={link} onClick={() => dispatch(setActiveMeal({meal: m[0]}))}>
                                        {m[0].name.charAt(0).toUpperCase() + m[0].name.slice(1)}
                                      </Link>
                                    </span>
                                    <span>{Math.floor(m[0].calories)}</span>
                                    <span>{date}</span>
                                  </li>
                                )})
                              }
                            </ul>
                          </div>
                      }
                    </li>
                )
              }
            </ul>
          </div>
        </div>
      }
      <div className="user__incription">
        <i>*<br />Базовый обмен веществ (уровень метаболизма) – это количество калорий, которое человеческий организм сжигает в состоянии покоя, то есть энергия затрачиваемая для обеспечения всех жизненных процессов (дыхания, кровообращения и т.д.). </i>
      </div>
    </div>
  )
}
