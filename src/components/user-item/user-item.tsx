import { useEffect, useState } from "react";
import { ActivityLevel, ActivityLevelTranslations, AppRoute, CaloricGoals, CaloricValues, MacronutrientRatios, Macronutrients, MealTypeTranslations, NutritionTarget, NutritionTargetToCaloricGoals, TrainingType, TrainingTypeTranslations } from "../../const";
import { User } from "../../types/user";
import { setUserGreetings } from "../../utils/setUserGreetings";
import { useDispatch } from "react-redux";
import { removeMealFromUserSchedule, removeTrainingFromUserSessions, updateUserActivity, updateUserTarget, updateUserWeight } from "../../store/api-actions";
import { ReactComponent as EditIcon } from "../../img/icons/edit-icon.svg";
import { ReactComponent as ApplyIcon } from "../../img/icons/apply-icon.svg";
import { ReactComponent as AddIcon } from "../../img/icons/add-icon.svg";
import { formatDate } from "../../utils/formatDate";
import { removeMeal, removeTrainingSession, setActiveMeal, setMealFormOpened, setTrainingFormOpened, setUserActivity, setUserTarget, setUserWeight } from "../../store/action";
import { getBasalMetabolicRate } from "../../utils/getBasalMetabolicRate";
import { groupByDate } from "../../utils/groupByDate";
import { ReactComponent as CollapseIcon } from "../../img/icons/down-icon.svg"
import { ReactComponent as Remove } from "../../img/icons/remove-icon.svg"
import { generatePath, Link } from "react-router-dom";
import { Ring } from "../ring/ring";
import { Meal } from "../../types/meal";
import { TrainingSession } from "../../types/trainingSession";

type UserItemProps = {
  user: User;
}

export function UserItem({ user }: UserItemProps): JSX.Element {
  const dispatch = useDispatch();
  const [isWeightEditable, setWeightEditable] = useState(false);
  const [isTargetEditable, setTargetEditable] = useState(false);
  const [isActivityEditable, setActivityEditable] = useState(false);
  const [weight, setWeight] = useState(user.weight);
  const [target, setTarget] = useState(user.target);
  const [activity, setActivity] = useState(user.activityLevel);

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
      await updateUserWeight(user, weight);
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
      await updateUserTarget(user, target);
      console.log('Target updated successfully');
    } catch (error) {
      console.error('Failed to update target:', error);
    }
  };

  useEffect(() => {
    setTarget(user.target);
  }, [user.target]);

  const handleEditActivity = async () => {
    dispatch(setUserActivity({ user, newActivity: activity }));
    setActivityEditable(false);
    try {
      await updateUserActivity(user, activity);
      console.log('Activity updated successfully');
    } catch (error) {
      console.error('Failed to update activity:', error);
    }
  };

  useEffect(() => {
    setActivity(user.activityLevel);
  }, [user.activityLevel]);

  const handleRemoveMeal = async (meal: Meal) => {
    await removeMealFromUserSchedule(user, meal)
    dispatch(removeMeal({user, meal}))
  }

  const handleRemoveTraining = async (training: TrainingSession) => {
    await removeTrainingFromUserSessions(user, training)
    dispatch(removeTrainingSession({user, training}))
  }

  const todayMeals = user.mealSchedule && user.mealSchedule.filter((m) => new Date(m[1]).getDate() === today)

  const bmr = getBasalMetabolicRate(user).valueOf();

  const totalCalorieTarget = calculateActiveBmr(bmr, user.activityLevel, user.target);

  const { proteins: proteinRatio, fats: fatRatio, carbs: carbRatio } = MacronutrientRatios[user.target];

  const caloricGoal = CaloricGoals[NutritionTargetToCaloricGoals[user.target]];
  const caloriesTarget = Math.round(totalCalorieTarget * caloricGoal);

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

  const [data, setData] = useState([
    { target: caloriesTarget, value: calories, field: 'calories', size: 316, gradientId: 'caloriesGradient', strokeColorStart: '#FFF12F', strokeColorEnd: '#FFD700' },
    { target: proteinsTarget, value: proteins, field: 'proteins', size: 247, gradientId: 'proteinsGradient', strokeColorStart: '#F6337A', strokeColorEnd: '#F71046' },
    { target: carbsTarget, value: carbs, field: 'carbs', size: 178, gradientId: 'carbsGradient', strokeColorStart: '#15C2E0', strokeColorEnd: '#1EF8D5' },
    { target: fatsTarget, value: fats, field: 'fats', size: 109, gradientId: 'fatsGradient', strokeColorStart: '#B1FD36', strokeColorEnd: '#6FE430' },
  ]);

  useEffect(() => {
    setData([
      { target: caloriesTarget, value: calories, field: 'calories', size: 316, gradientId: 'caloriesGradient', strokeColorStart: '#FFF12F', strokeColorEnd: '#FFD700' },
      { target: proteinsTarget, value: proteins, field: 'proteins', size: 247, gradientId: 'proteinsGradient', strokeColorStart: '#F6337A', strokeColorEnd: '#F71046' },
      { target: carbsTarget, value: carbs, field: 'carbs', size: 178, gradientId: 'carbsGradient', strokeColorStart: '#15C2E0', strokeColorEnd: '#1EF8D5' },
      { target: fatsTarget, value: fats, field: 'fats', size: 109, gradientId: 'fatsGradient', strokeColorStart: '#B1FD36', strokeColorEnd: '#6FE430' },
    ]);
  }, [caloriesTarget, calories, proteinsTarget, proteins, carbsTarget, carbs, fatsTarget, fats]);


  return (
    <div className="user">
      <div className="user__wrapper">
        <p className="user__name">{setUserGreetings(user.name)}</p>
        <div className="user__info">
          <div className="dashboard">
            <div className="ring-wrapper">
              {data.map((ring) => (
                <Ring key={ring.field} {...ring} />
              ))}
            </div>
            <div className="info-wrapper">
              {data.map((ring) => (
                <div className="info" key={`${ring.field}`} id={`${ring.field}Value`}>
                  <span className="info__name">{Macronutrients[ring.field.charAt(0).toUpperCase() + ring.field.slice(1) as keyof typeof Macronutrients]}</span>
                  <p className="info__accent" style={{ color: ring.strokeColorEnd }}>{ring.value}/<span>{ring.target}</span></p>
                </div>
              ))}
            </div>
          </div>
          <div className="user__today">
            <p>Твой базовый обмен веществ: <b>{bmr}</b> ккал в день.*</p>
            <p>Учитывая твой уровень физической нагрузки (<i>{ActivityLevelTranslations[user.activityLevel].toLowerCase()}</i>) твоя суточная потребность калорий <b>{totalCalorieTarget}</b> ккал, но учитывая твою цель (<i>{user.target.toLowerCase()}</i>), тебе необходимо получать из пищи <b>{caloriesTarget}</b> ккал.</p>
            {
              totalCalorieTarget - calories > 0
              ?
              <p>Сегодня ты в дефиците на <b>{totalCalorieTarget - calories}</b> ккал.</p>
              :
              <p>Сегодня ты в профиците на <b>{totalCalorieTarget - calories}</b> ккал.</p>
            }
          </div>
          <div className="user__settings">
            <p className="user__editable-wrapper">
              <span className="user__editable-title">Твой вес:</span>
              {
                isWeightEditable
                  ?
                  <label className="user__editable-weight" htmlFor="user-edit-weight">
                    <input className="form__input user__editable-info user__editable-info--on" autoFocus={isWeightEditable} type="number" id="user-edit-weight" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
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
              <span className="user__editable-title">Твоя цель:</span>
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
            <p className="user__editable-wrapper">
              <span className="user__editable-title">Твоя активность:</span>
              {
                isActivityEditable
                  ?
                  <select
                    className="user__editable-info user__editable-info--select user__editable-info--on"
                    name="user-change-activity"
                    id="user-change-activity"
                    value={activity}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (Object.values(ActivityLevel).includes(value)) {
                        setActivity(value as ActivityLevel);
                      } else {
                        console.error(`Invalid activity level: ${value}`);
                      }
                    }}
                  >
                    {
                      Object.values(ActivityLevel)
                        .filter((level) => typeof level === 'number') // Фильтруем только числовые значения
                        .map((level) => (
                          <option
                            value={level}
                            key={`${user.name}-activity-${level}`}
                          >
                            {ActivityLevelTranslations[level as ActivityLevel]}
                          </option>
                        ))
                    }
                  </select>

                  :
                  <span className="user__editable-info">
                    {ActivityLevelTranslations[user.activityLevel as ActivityLevel]}
                  </span>
              }
              <button
                className="button button--icon"
                type="button"
                onClick={() => {
                  if (isActivityEditable) {
                    handleEditActivity();
                  } else {
                    setActivityEditable(true);
                  }
                }}
              >
                {
                  isActivityEditable
                    ? <ApplyIcon />
                    : <EditIcon />
                }
                <span className="visually-hidden">
                  {isActivityEditable ? 'apply' : 'edit'}
                </span>
              </button>
            </p>
          </div>
        </div>
        <div className="user__incription">
          <i>*<br />Базовый обмен веществ (уровень метаболизма) – это количество калорий, которое человеческий организм сжигает в состоянии покоя, то есть энергия затрачиваемая для обеспечения всех жизненных процессов (дыхания, кровообращения и т.д.). </i>
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
              <span></span>
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
                          <div className="user-actions__date-wrapper" onClick={() => toggleTrainingDate(date)}>
                            <p>{date}</p>
                            <CollapseIcon className="icon" />
                          </div>
                        </div>
                        :
                        <div
                          className="user-actions__group-header user-actions__group-header--opened"
                        >
                          <div className="user-actions__date-wrapper" onClick={() => toggleTrainingDate(date)}>
                            <p>{date}</p>
                            <CollapseIcon className="icon icon--rotated" />
                          </div>
                          <ul className="user-actions__sublist">
                            {sessions.map((t) => (
                              <li
                                className="user-actions__item user-actions__item--trainings"
                                key={`${user.name}-training-${t.activity}-${t.duration}-${new Date(t.date).getDay()}`}
                              >
                                <div className="user-actions__item-wrapper">
                                  <span>{TrainingTypeTranslations[t.activity as TrainingType]}</span>
                                  <span>{Math.floor(t.caloriesBurned)}</span>
                                </div>
                                <button className="button button--remove" onClick={() => handleRemoveTraining(t)}><Remove/></button>
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
                            <div className="user-actions__date-wrapper" onClick={() => toggleMealsDate(date)}>
                              <p>{date}</p>
                              <CollapseIcon className="icon" />
                            </div>
                          </div>
                          :
                          <div
                            className="user-actions__group-header user-actions__group-header--opened"
                          >
                            <div className="user-actions__date-wrapper" onClick={() => toggleMealsDate(date)}>
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
                                    <div className="user-actions__item-wrapper">
                                      <span>{MealTypeTranslations[m[0].type]}</span>
                                      <span>
                                        <Link className="user-actions__item-link" to={link} onClick={() => dispatch(setActiveMeal({meal: m[0]}))}>
                                          {m[0].name.charAt(0).toUpperCase() + m[0].name.slice(1)}
                                        </Link>
                                      </span>
                                      <span>{Math.floor(m[0].calories)}</span>
                                    </div>
                                    <button className="button button--remove" onClick={() => handleRemoveMeal(m[0])}><Remove/></button>
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
    </div>
  )
}
