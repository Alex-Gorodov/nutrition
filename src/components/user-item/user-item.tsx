import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { useEffect, useState } from "react";
import { User } from "../../types/user";

export function UserItem(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);

  const users = useSelector((state: RootState) => state.data.users);
  const meals = useSelector((state: RootState) => state.data.meals);

  useEffect(() => {
    users ? setUser(users[0]) : setUser(null);
  }, [users, meals])

  return (
    <div>
      user: {user ? user.name : 'load user'}
    </div>
  )
}
