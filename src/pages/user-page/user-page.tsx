import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { UserItem } from "../../components/user-item/user-item";

export function UserPage(): JSX.Element {
  const authUser = useSelector((state: RootState) => state.auth.userInfo);

  const activeUser = useSelector((state: RootState) =>
    state.data.users.find((user) => user.id === authUser?.id)
  );

  return (
    <>
      <Helmet>
        <title>Nutrition | {`${activeUser?.name}`}</title>
      </Helmet>
      {activeUser ? <UserItem user={activeUser}/> : <></>}
    </>
  )
}
