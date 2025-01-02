import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { ChooseMeal } from "../../components/choose-meal/choose-meal";
import { ChooseTraining } from "../../components/choose-training/choose-training";
import { Helmet } from "react-helmet-async";
import { UserDashboard } from "../../components/user-item/user-dashboard";
import { setUserGreetings } from "../../utils/setUserGreetings";

export function HomePage(): JSX.Element {
  const activeMeal = useSelector((state: RootState) => state.page.activeMeal);
  const authUser = useSelector((state: RootState) => state.auth.userInfo);

  const activeUser = useSelector((state: RootState) =>
    state.data.users.find((user) => user.id === authUser?.id)
  );

  return (
    <>
      <Helmet>
        <title>Nutrition</title>
      </Helmet>
      {
        activeUser &&
        <div className="container">
          {<p className="user__name">{setUserGreetings(activeUser.name)}</p>}
          {<UserDashboard user={activeUser}/>}
        </div>
      }
      <ChooseMeal />
      {!activeMeal && <ChooseTraining />}
    </>
  );
}
