import {  useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { useEffect, useState } from "react";
import { User } from "../../types/user";
import { generatePath, Link } from "react-router-dom";
import { AppRoute } from "../../const";
import { useGetUser } from "../../hooks/useGetUser";
import { LoadingSpinner } from "../loading-spinner/loading-spinner";
import { ReactComponent as UserIcon } from "../../img/icons/user-icon.svg";

export function HeaderUserItem(): JSX.Element {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const authUser = useSelector((state: RootState) => state.auth.userInfo);

  const activeUser = useSelector((state: RootState) =>
    state.data.users.find((user) => user.id === authUser?.id)
  );

  useEffect(() => {
    activeUser && setSelectedUser(activeUser);
  }, [activeUser]);

  const user = useGetUser();

  const link = generatePath(AppRoute.UserPage, {
    id: `${user?.id}`,
  });

  return (
    selectedUser ?
    <div className="header-user">
      <Link className="header-user__link header-nav__item" to={link}>
        {
          selectedUser.avatar.length > 0
          ?
          <img className="header-user__image" src={selectedUser.avatar} width={40} height={40} alt={selectedUser.name} />
          :
          <UserIcon/>
        }
      </Link>
    </div> : <LoadingSpinner size={"20"}/>
  );
}
