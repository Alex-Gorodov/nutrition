import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { Layout } from "../../components/layout/layout";
import { RootState } from "../../store/root-reducer";
import { UserItem } from "../../components/user-item/user-item";
import { users } from "../../mocks/users";

export function UserPage(): JSX.Element {
  const authUser = useSelector((state: RootState) => state.auth.userInfo);

  const activeUser = useSelector((state: RootState) =>
    users.find((user) => user.id === authUser?.id)
    // state.data.users.find((user) => user.id === authUser?.id)
  );

  return (
    <Layout>
      <Helmet>
        <title>Nutrition | {`${activeUser?.name}`}</title>
      </Helmet>
      {activeUser && <UserItem user={activeUser}/>}
    </Layout>
  )
}
