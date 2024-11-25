import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { useEffect, useState } from "react";
import { User } from "../../types/user";

export function UserItem(): JSX.Element {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const authUser = useSelector((state: RootState) => state.auth.userInfo);

  const activeUser = useSelector((state: RootState) =>
    state.data.users.find((user) => user.id === authUser?.id)
  );

  useEffect(() => {
    activeUser && setSelectedUser(activeUser);
  }, [activeUser]);

  return (
    <div>
      {selectedUser ? `Hi, ${selectedUser.name}` : 'loading user...'}
      {selectedUser && <img src={selectedUser.avatar} width={40} height={40} alt="" />}
    </div>
  );
}
