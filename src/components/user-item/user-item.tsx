import { User } from "../../types/user";
import { userGreetings } from "../../utils/user-greetings";

type UserItemProps = {
  user: User;
}

export function UserItem({user}: UserItemProps): JSX.Element {
  return (
    <div className="user">
      <div className="user__avatar-wrapper">
        <img className="user__avatar" src={user.avatar} alt={user.name} width={120} height={120}/>
      </div>
      <p className="user__name">{userGreetings(user.name)}</p>
      <div className="user__trainings rename-class">
        <ul className="rename-class__list">
          {
            user.trainingSessions && user.trainingSessions.map((t) => {
              return (
                <li className="rename-class__item rename-class__item--trainings" key={`${user.name}-training-${t.activity}-${t.duration}`}>
                  <span>{t.date.getTime()}</span>
                  <span>{t.activity}</span>
                  <span>{t.caloriesBurned}</span>
                </li>
              )
            })
          }
        </ul>
      </div>
      <div className="user__meals rename-class">
          <ul className="rename-class__list">
            {
              user.mealSchedule && user.mealSchedule.map((m) => {
                return (
                  <li className="rename-class__item rename-class__item--meal">
                    <span>{m[1].getTime()}</span>
                    <span>{m[0].type}</span>
                    <span>{m[0].name}</span>
                    <span>{m[0].calories}</span>
                  </li>
                )
              })
            }
          </ul>
      </div>
    </div>
  )
}
