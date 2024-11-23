import { Helmet } from "react-helmet-async";
import { Layout } from "../../components/layout/layout";
import { UserItem } from "../../components/user-item/user-item";
import { FindMeal } from "../../components/find-meal/find-meal";
import { RegisterForm } from "../../components/register-form/register-form";
import { MealAddingForm } from "../../components/meal-adding-form/meal-adding-form";
import { AuthForm } from "../../components/auth-form/auth-form";
import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { AuthorizationStatus } from "../../const";

export function HomePage(): JSX.Element {

  const authorizationStatus = useSelector((state: RootState) => state.auth.authorizationStatus);

  return (
    <Layout>
      <Helmet>
        <title>Nutrition</title>
      </Helmet>
      {
        authorizationStatus === AuthorizationStatus.Auth
        ?
        <UserItem/>
        :
        <AuthForm/>
      }
      <FindMeal/>
      {/* <RegisterForm/> */}
      <MealAddingForm/>
    </Layout>
  );
}
