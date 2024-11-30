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
    </div>
  )
}
