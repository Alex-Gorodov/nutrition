import { useSelector } from "react-redux";
import { RootState } from "../store/root-reducer";
import { User } from "../types/user";

export function useGetUser(): User | undefined {
  const authedUser = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.data.users);
  const user = users.find((user) => user.id === authedUser.id);

  return user;
}
