import { useEffect, useState } from "react";
import { MealTypeTranslations, NutritionTarget, TrainingTypeTranslations } from "../../const";
import { User } from "../../types/user";
import { userGreetings } from "../../utils/user-greetings";
import { useDispatch } from "react-redux";
import { updateUserTarget, updateUserWeight } from "../../store/api-actions";
import { ReactComponent as EditIcon } from "../../img/icons/edit-icon.svg";
import { ReactComponent as ApplyIcon } from "../../img/icons/apply-icon.svg";
import { formatDate } from "../../utils/format-date";

type UserItemProps = {
  user: User;
}

export function UserItem({user}: UserItemProps): JSX.Element {
  const dispatch = useDispatch();
  const [isWeightEditable, setWeightEditable] = useState(false);
  const [isTargetEditable, setTargetEditable] = useState(false);
  const [weight, setWeight] = useState(user.weight);
  const [target, setTarget] = useState(user.target);

  const handleEditWeight = async () => {
    try {
      await updateUserWeight(user, weight, dispatch);
      setWeightEditable(false);
      console.log("Weight updated successfully");
    } catch (error) {
      console.error("Failed to update weight", error);
    }
  };

  useEffect(() => {
    setWeight(user.weight);
  }, [user.weight]);

  const handleEditTarget = async () => {
    console.log('Target before saving:', target);
    try {
      await updateUserTarget(user, target, dispatch);
      setTargetEditable(false);
      console.log('Target updated successfully');
    } catch (error) {
      console.error('Failed to update target:', error);
    }
  };

  useEffect(() => {
    setTarget(user.target);
  }, [user.target]);

  return (
    <div className="user">
      <div className="user__wrapper">
        <div className="user__info">
          <p className="user__name">{userGreetings(user.name)}</p>
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
              <select className="user__editable-info user__editable-info--on" name="user-change-target" id="user-change-target" value={target}
                onChange={(e) => {
                  const newTarget = e.target.value as NutritionTarget;
                  console.log('Selected target:', newTarget);
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
      {
        user.trainingSessions && user.trainingSessions.length > 0
        &&
        <div className="user__trainings user-actions">
          <h3 className="user-actions__title title title--3">Тренировки</h3>
          <div className="user-actions__table">
            <div className="user-actions__head">
              <span>Активность</span>
              <span>Сожжено калорий</span>
              <span>Дата</span>
            </div>
            <ul className="user-actions__list">
              {
                user.trainingSessions.map((t) => {
                  const date = formatDate(t.date);
                  return (
                    <li className="user-actions__item user-actions__item--trainings" key={`${user.name}-training-${t.activity}-${t.duration}`}>
                      <span>{TrainingTypeTranslations[t.activity]}</span>
                      <span>{Math.floor(t.caloriesBurned)}</span>
                      <span>{date}</span>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div>
      }
      {
        user.mealSchedule && user.mealSchedule.length > 0
        &&
        <div className="user__meals user-actions">
          <h3 className="user-actions__title title title--3">Приемы пищи</h3>
          <div className="user-actions__table">
            <div className="user-actions__head">
              <span>Прием пищи</span>
              <span>Название блюда</span>
              <span>Получено калорий</span>
              <span>Дата</span>
            </div>
            <ul className="user-actions__list">
              {
                user.mealSchedule.map((m) => {
                  const date = formatDate(m[1]);
                  return (
                    <li className={`user-actions__item user-actions__item--meal user-actions__item--${m[0].type.toLowerCase()}`} key={m[0].name}>
                      <span>{MealTypeTranslations[m[0].type]}</span>
                      <span>{m[0].name}</span>
                      <span>{Math.floor(m[0].calories)}</span>
                      <span>{date}</span>
                    </li>
                  )
                })
              }
            </ul>
          </div>
      </div>
      }
    </div>
  )
}
