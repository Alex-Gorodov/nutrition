import { Helmet } from "react-helmet-async";
import { Layout } from "../../components/layout/layout";
import { UserItem } from "../../components/user-item/user-item";
import { FindMeal } from "../../components/find-meal/find-meal";
import { MealAddingForm } from "../../components/meal-adding-form/meal-adding-form";
import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { AuthorizationStatus } from "../../const";

export function HomePage(): JSX.Element {

  const authorizationStatus = useSelector((state: RootState) => state.auth.authorizationStatus);

  const auth = authorizationStatus === AuthorizationStatus.Auth;

  return (
    <Layout>
      <Helmet>
        <title>Nutrition</title>
      </Helmet>
      {
        auth
        &&
        <div>
          <UserItem/>
          <FindMeal/>
          <MealAddingForm/>
        </div>
      }
    </Layout>
  );
}
