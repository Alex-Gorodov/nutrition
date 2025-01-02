import { useEffect, useState } from "react";
import { ActivityLevel, ActivityLevelTranslations, AppRoute, CaloricGoals, MealTypeTranslations, NutritionTarget, NutritionTargetToCaloricGoals, ScreenSizes, TrainingType, TrainingTypeTranslations } from "../../const";
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
import { ReactComponent as Info } from "../../img/icons/info-icon.svg"
import { ReactComponent as Remove } from "../../img/icons/remove-icon.svg"
import { generatePath, Link } from "react-router-dom";
import { UserMealData } from "../../types/meal";
import { TrainingSession } from "../../types/trainingSession";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { getCapitalizeString } from "../../utils/getCapitalizeString";
import { calculateActiveBmr } from "../../utils/calculateActiveBmr";
import { UserDashboard } from "./user-dashboard";

type UserItemProps = {
  user: User;
}

export function UserItem({ user }: UserItemProps): JSX.Element {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(ScreenSizes.MobileOnly);
  const [isWeightEditable, setWeightEditable] = useState(false);
  const [isTargetEditable, setTargetEditable] = useState(false);
  const [isActivityEditable, setActivityEditable] = useState(false);
  const [weight, setWeight] = useState(user.weight);
  const [target, setTarget] = useState(user.target);
  const [activity, setActivity] = useState(user.activityLevel);
  const [isShowTooltip, setShowTooltip] = useState(false);

  const [trainingExpandedDates, setTrainingExpandedDates] = useState<Record<string, boolean>>({});
  const [mealsExpandedDates, setMealsExpandedDates] = useState<Record<string, boolean>>({});

  const [removingMealId, setRemovingMealId] = useState<string | null>(null);
  const [removingTrainingId, setRemovingTrainingId] = useState<string | null>(null);

  const userMeals = user.mealSchedule;
  const userTrainings = user.trainingSessions;

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

  const tooltipRef = useOutsideClick(() => {
    setShowTooltip(false);
  }) as React.RefObject<HTMLDivElement>;

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
    setWeight(user.weight);
    setTarget(user.target);
    setActivity(user.activityLevel);
  }, [user.target, user.weight, user.activityLevel]);

  const handleRemoveMeal = async (meal: UserMealData) => {
    const mealToRemove = userMeals.find((m) => m[0].id === meal.id);
    console.log('this id: ', mealToRemove?.[0].id);
    mealToRemove && setRemovingMealId(mealToRemove[0].id);

    setTimeout(async () => {
      mealToRemove && await removeMealFromUserSchedule(user, mealToRemove[0])
      mealToRemove && dispatch(removeMeal({user, meal: mealToRemove[0]}))
      setRemovingMealId(null);
    }, 500)
  }

  const handleRemoveTraining = async (training: TrainingSession) => {
    setRemovingTrainingId(training.id)
    setTimeout(async () => {
      await removeTrainingFromUserSessions(user, training)
      dispatch(removeTrainingSession({user, training}))
      setRemovingTrainingId(null);
    }, 500)
  }

  const todayMeals = userMeals && userMeals.filter((m) => new Date(m[1]).getDate() === today)

  const bmr = getBasalMetabolicRate(user).valueOf();

  const totalCalorieTarget = calculateActiveBmr(bmr, user.activityLevel, user.target);

  const caloricGoal = CaloricGoals[NutritionTargetToCaloricGoals[user.target]];
  const caloriesTarget = Math.round(totalCalorieTarget * caloricGoal);

  let calories = 0;
  todayMeals && todayMeals.forEach((m) => {
    calories += m[0].calories
  })

  return (
    <div className="user">
      <div className="user__wrapper">
        <p className="user__name">{setUserGreetings(user.name)}</p>
        <div className="user__info">
          <UserDashboard user={user}/>
          <div className="user__today">
            <div className="user__today-base">Твой базовый обмен веществ: {isMobile && <br/>} <b>{bmr}</b> ккал в день.
              <button
                className="button button--reset button--tooltip user__today-tooltip-btn"
                onClick={() => setShowTooltip(!isShowTooltip)}
              >
                <Info/>
              </button>
              {
                isShowTooltip
                &&
                <p className="user__today-tooltip" ref={tooltipRef}>
                  <i>Базовый обмен веществ (уровень метаболизма) – это количество калорий, которое человеческий организм сжигает в состоянии покоя, то есть энергия затрачиваемая для обеспечения всех жизненных процессов (дыхания, кровообращения и т.д.). </i>
                </p>
              }
            </div>
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
      </div>
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
          {
            userTrainings && userTrainings.length > 0 && (
              <div className="user-actions__container">
                <ul className="user-actions__list">
                  {Object.entries(groupByDate(userTrainings, (t) => formatDate(new Date(t.date)))).map(
                    ([date, sessions]) =>
                      <li key={`training-group-${date}`}>
                        {
                          !trainingExpandedDates[date]
                            ?
                            <div
                              className="user-actions__group-header"
                            >
                              <div className="user-actions__date-wrapper" onClick={() => toggleTrainingDate(date)}>
                                <p className="user-actions__date">{date}</p>
                                <CollapseIcon className="icon" />
                              </div>
                            </div>
                            :
                            <div
                              className="user-actions__group-header user-actions__group-header--opened"
                            >
                              <div className="user-actions__date-wrapper" onClick={() => toggleTrainingDate(date)}>
                                <p className="user-actions__date">{date}</p>
                                <CollapseIcon className="icon icon--rotated" />
                              </div>
                              <ul className="user-actions__sublist">
                                {
                                  sessions.map((t) => {
                                    const isRemoving = removingTrainingId === t.id;
                                    return (
                                      <li
                                        className={`user-actions__item user-actions__item--trainings ${isRemoving && 'user-actions__removing'}`}
                                        key={`${user.name}-training-${t.activity}-${t.duration}-${new Date(t.date).getDay()}`}
                                      >
                                        <div className="user-actions__item-wrapper">
                                          <b>{TrainingTypeTranslations[t.activity as TrainingType]}</b>
                                          <span>Сожжено калорий: <b>{Math.floor(t.caloriesBurned)}</b></span>
                                        </div>
                                        <button className="button button--remove user-actions__remove-btn" onClick={() => handleRemoveTraining(t)}>
                                          <span className="visually-hidden">Удалить тренировку</span>
                                          <Remove/>
                                        </button>
                                      </li>
                                    )})}
                              </ul>
                            </div>
                        }
                      </li>
                  )
                  }
                </ul>
              </div>
            )
          }
      </div>
      <div className="user__meals user-actions">
        <div className="user-actions__title-wrapper">
          <h3 className="user-actions__title title title--3">Приемы пищи</h3>
          <button className="button button--reset user-actions__add-btn" onClick={() => dispatch(setMealFormOpened({ isOpened: true }))}><AddIcon /></button>
        </div>
          {
            userMeals && userMeals.length > 0 &&
              <div className="user-actions__container">
                <ul className="user-actions__list">
                  {
                    Object.entries(groupByDate(userMeals, (m) => formatDate(m[1]))).map(
                      ([date, schedule]) =>
                        <li key={`${schedule[0][0].name}-${schedule[0]}-${date}`}>
                          {
                            !mealsExpandedDates[date]
                              ?
                              <div
                                className="user-actions__group-header"
                              >
                                <div className="user-actions__date-wrapper" onClick={() => toggleMealsDate(date)}>
                                  <p className="user-actions__date">{date}</p>
                                  <CollapseIcon className="icon" />
                                </div>
                              </div>
                              :
                              <div
                                className="user-actions__group-header user-actions__group-header--opened"
                              >
                                <div className="user-actions__date-wrapper" onClick={() => toggleMealsDate(date)}>
                                  <p className="user-actions__date">{date}</p>
                                  <CollapseIcon className="icon icon--rotated" />
                                </div>
                                <ul className="user-actions__sublist">
                                  {

                                    schedule.map((m, i) => {
                                      const link = generatePath(AppRoute.MealPage, { id: m[0].id });
                                      const isRemoving = removingMealId === m[0].id;

                                      return (
                                      <li
                                        className={`user-actions__item user-actions__item--meal user-actions__item--${m[0].type.toLowerCase()} ${isRemoving && 'user-actions__removing'}`}
                                        key={`${m[0].name}-${m[0]}-${date}-${i}`}
                                      >
                                        <div className="user-actions__item-wrapper">
                                          <span>{MealTypeTranslations[m[0].type]}</span>
                                          <span className="user-actions__link-wrapper">
                                            <Link className="user-actions__item-link" to={link} onClick={() => dispatch(setActiveMeal({meal: m[0]}))}>
                                              {getCapitalizeString(m[0].name)}
                                            </Link>
                                          </span>
                                          <p className="user-actions__meal-maintenance">
                                            <span>Ккал: {Math.floor(m[0].calories)}</span>
                                            <span>Б: {Math.floor(m[0].proteins)}г</span>
                                            <span>Ж: {Math.floor(m[0].fats)}г</span>
                                            <span>У: {Math.floor(m[0].carbs)}г</span>
                                          </p>
                                        </div>
                                        <button className="button button--remove user-actions__remove-btn" onClick={() => handleRemoveMeal(m[0])}>
                                          <span className="visually-hidden">Удалить прием пищи</span>
                                          <Remove/>
                                        </button>
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
          }
        </div>
    </div>
  )
}
