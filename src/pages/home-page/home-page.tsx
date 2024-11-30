import { Helmet } from "react-helmet-async";
import { Layout } from "../../components/layout/layout";
import { FindMeal } from "../../components/find-meal/find-meal";
import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { AuthorizationStatus } from "../../const";
import { AuthForm } from "../../components/auth-form/auth-form";
import { RegisterForm } from "../../components/register-form/register-form";

export function HomePage(): JSX.Element {

  const authorizationStatus = useSelector((state: RootState) => state.auth.authorizationStatus);
  const isLoginFormOpened = useSelector((state: RootState) => state.page.isLoginFormOpened)
  const isRegistrationFormOpened = useSelector((state: RootState) => state.page.isRegisterFormOpened);

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
          <FindMeal/>
        </div>
      }
      {
        isLoginFormOpened && <AuthForm/>
      }
      {
        isRegistrationFormOpened && <RegisterForm/>
      }
    </Layout>
  );
}
