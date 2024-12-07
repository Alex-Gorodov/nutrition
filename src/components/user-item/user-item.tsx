import { MealTypeTranslations, Months, TrainingTypeTranslations } from "../../const";
import { User } from "../../types/user";
import { userGreetings } from "../../utils/user-greetings";

type UserItemProps = {
  user: User;
}

export function UserItem({user}: UserItemProps): JSX.Element {
  return (
    <div className="user">
      <div className="user__wrapper">
        <div className="user__avatar-wrapper">
          <img className="user__avatar" src={user.avatar} alt={user.name} width={120} height={120}/>
        </div>
        <p className="user__name">{userGreetings(user.name)}</p>
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
                  const dateDay = new Date(t.date).getDate();
                  const dateMonth = Months[new Date(t.date).getMonth()];
                  const dateYear = new Date(t.date).getFullYear();

                  const date = dateDay + ', ' + dateMonth + ', ' + dateYear;
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
                  const dateDay = new Date(m[1]).getDate();
                  const dateMonth = Months[new Date(m[1]).getMonth()];
                  const dateYear = new Date(m[1]).getFullYear();

                  const date = dateDay + ', ' + dateMonth + ', ' + dateYear;

                  return (
                    <li className="user-actions__item user-actions__item--meal">
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
