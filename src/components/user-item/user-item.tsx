import { useEffect, useState } from "react";
import { ActivityLevelTranslations, MealTypeTranslations, NutritionTarget, TrainingTypeTranslations } from "../../const";
import { User } from "../../types/user";
import { userGreetings } from "../../utils/user-greetings";
import { useDispatch, useSelector } from "react-redux";
import { updateUserTarget, updateUserWeight } from "../../store/api-actions";
import { ReactComponent as EditIcon } from "../../img/icons/edit-icon.svg";
import { ReactComponent as ApplyIcon } from "../../img/icons/apply-icon.svg";
import { ReactComponent as AddIcon } from "../../img/icons/add-icon.svg";
import { formatDate } from "../../utils/format-date";
import { setMealFormOpened, setTrainingFormOpened, setUserTarget, setUserWeight } from "../../store/action";
import { getBasalMetabolicRate } from "../../utils/getBasalMetabolicRate";
import { RootState } from "../../store/root-reducer";
import { AddMeal } from "../add-meal/add-meal";
import { AddTraining } from "../add-training/add-training";
import { groupByDate } from "../../utils/groupByDate";
import { ReactComponent as CollapseIcon} from "../../img/icons/down-icon.svg"

type UserItemProps = {
  user: User;
}

export function UserItem({user}: UserItemProps): JSX.Element {
  const dispatch = useDispatch();
  const [isWeightEditable, setWeightEditable] = useState(false);
  const [isTargetEditable, setTargetEditable] = useState(false);
  const [weight, setWeight] = useState(user.weight);
  const [target, setTarget] = useState(user.target);

  const isTrainingFormOpened = useSelector((state: RootState) => state.page.isTrainingFormOpened);
  const isMealFormOpened = useSelector((state: RootState) => state.page.isMealFormOpened);

  const [trainingExpandedDates, setTrainingExpandedDates] = useState<Record<string, boolean>>({});
  const [mealsExpandedDates, setMealsExpandedDates] = useState<Record<string, boolean>>({});

  const toggleTrainingDate = (date: string) => {
    setTrainingExpandedDates((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [date]: !prev[date],
    }));
  };

  const toggleMealsDate = (date: string) => {
    setMealsExpandedDates((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [date]: !prev[date],
    }));
  };


  const handleEditWeight = async () => {
    dispatch(setUserWeight({user, newWeight: weight}));
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

  const bmr = getBasalMetabolicRate(user).valueOf();
  const activeBmr = Math.floor(bmr * user.activityLevel);

  return (
    <div className="user">
      <div className="user__wrapper">
        <div className="user__info">
          <p className="user__name">{userGreetings(user.name)}</p>
          <p>Ваш базовый обмен веществ: <b>{bmr}</b> ккал в день.*</p>
          <p>Учитывая ваш уровень физической нагрузки ({ActivityLevelTranslations[user.activityLevel].toLowerCase()}), вам необходимо получать из пищи <b>{activeBmr}</b> ккал.</p>
          <p className="user__editable-wrapper">
            <span className="user__editable-title">Ваш вес:</span>
            {
              isWeightEditable
              ?
              <label className="user__editable-weight" htmlFor="user-edit-weight">
                <input className="user__editable-info user__editable-info--on" autoFocus={isWeightEditable} type="number" id="user-edit-weight" value={weight} onChange={(e) => setWeight(Number(e.target.value))}/>
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
                <ApplyIcon/>
                :
                <EditIcon/>
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
                <ApplyIcon/>
                :
                <EditIcon/>
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
              {Object.entries(groupByDate(user.trainingSessions, (t) => formatDate(t.date))).map(
                ([date, sessions]) =>
                  sessions.length === 1 ? (
                    <li
                      className="user-actions__item user-actions__item--trainings"
                      key={`${user.name}-training-${sessions[0].activity}-${sessions[0].duration}`}
                    >
                      <span>{TrainingTypeTranslations[sessions[0].activity]}</span>
                      <span>{Math.floor(sessions[0].caloriesBurned)}</span>
                      <span>{date}</span>
                    </li>
                  ) : (
                  <li key={`training-group-${date}`}>
                    {
                      !trainingExpandedDates[date]
                      ?
                        <div
                          className="user-actions__group-header"
                          onClick={() => toggleTrainingDate(date)}
                        >
                          <div>
                            <p>{date}</p>
                            <CollapseIcon className="icon"/>
                          </div>
                        </div>
                        :
                        <div
                          className="user-actions__group-header"
                          onClick={() => toggleTrainingDate(date)}
                        >
                          <div>
                            <p>{date}</p>
                            <CollapseIcon className="icon icon--rotated"/>
                          </div>
                          <ul className="user-actions__sublist">
                        {sessions.map((t) => (
                          <li
                            className="user-actions__item user-actions__item--trainings"
                            key={`${user.name}-training-${t.activity}-${t.duration}`}
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
              )}
            </ul>
          </div>
        </div>
      )}
      <div className="user__meals user-actions">
        <div className="user-actions__title-wrapper">
          <h3 className="user-actions__title title title--3">Приемы пищи</h3>
          <button className="button button--reset user-actions__add-btn" onClick={() => dispatch(setMealFormOpened({isOpened: true}))}><AddIcon/></button>
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
                schedule.length === 1 ? (
                  <li
                      className={`user-actions__item user-actions__item--meal user-actions__item--${schedule[0][0].type.toLowerCase()}`}
                      key={`${schedule[0][0].name}-${schedule[0]}-${date}`}
                    >
                      <span>{MealTypeTranslations[schedule[0][0].type]}</span>
                      <span>{schedule[0][0].name.charAt(0).toUpperCase() + schedule[0][0].name.slice(1)}</span>
                      <span>{Math.floor(schedule[0][0].calories)}</span>
                      <span>{date}</span>
                    </li>
                ) : (
                  <li key={`${schedule[0][0].name}-${schedule[0]}-${date}`}>
                    {
                      !mealsExpandedDates[date]
                      ?
                      <div
                        className="user-actions__group-header"
                        onClick={() => toggleMealsDate(date)}
                      >
                        <div>
                          <p>{date}</p>
                          <CollapseIcon className="icon"/>
                        </div>
                      </div>
                      :
                      <div
                        className="user-actions__group-header"
                        onClick={() => toggleMealsDate(date)}
                      >
                        <div>
                          <p>{date}</p>
                          <CollapseIcon className="icon icon--rotated"/>
                        </div>
                        <ul className="user-actions__sublist">
                          {
                            schedule.map((m) => (
                              <li
                                className={`user-actions__item user-actions__item--meal user-actions__item--${schedule[0][0].type.toLowerCase()}`}
                                key={`${schedule[0][0].name}-${schedule[0]}-${date}`}
                              >
                                <span>{MealTypeTranslations[schedule[0][0].type]}</span>
                                <span>{schedule[0][0].name.charAt(0).toUpperCase() + schedule[0][0].name.slice(1)}</span>
                                <span>{Math.floor(schedule[0][0].calories)}</span>
                                <span>{date}</span>
                              </li>
                            ))
                          }
                        </ul>

                      </div>

                    }
                  </li>
                )
            )
          }
          </ul>
        </div>
      </div>
      <div className="user__incription">
        <i>*<br/>Базовый обмен веществ (уровень метаболизма) – это количество калорий, которое человеческий организм сжигает в состоянии покоя, то есть энергия затрачиваемая для обеспечения всех жизненных процессов (дыхания, кровообращения и т.д.). </i>
      </div>
      {isTrainingFormOpened ? <AddTraining isTrainingTypeUnset/> : ''}
      {isMealFormOpened ? <AddMeal/> : ''}
    </div>
  )
}