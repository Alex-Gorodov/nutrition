import { Helmet } from "react-helmet-async";
import { Layout } from "../../components/layout/layout";
import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { AuthorizationStatus } from "../../const";
import { AuthForm } from "../../components/auth-form/auth-form";
import { RegisterForm } from "../../components/register-form/register-form";
import { ChooseMeal } from "../../components/choose-meal/choose-meal";
import { ChooseTraining } from "../../components/choose-training/choose-training";
import { AddTraining } from "../../components/add-training/add-training";
import { MealAddingForm } from "../../components/meal-adding-form/meal-adding-form";

export function HomePage(): JSX.Element {

  const authorizationStatus = useSelector((state: RootState) => state.auth.authorizationStatus);
  const isLoginFormOpened = useSelector((state: RootState) => state.page.isLoginFormOpened)
  const isRegistrationFormOpened = useSelector((state: RootState) => state.page.isRegisterFormOpened);
  const isAddMealFormOpened = useSelector((state: RootState) => state.page.isNewMealFormOpened);
  const isTrainingFormOpened = useSelector((state: RootState) => state.page.isTrainingFormOpened);
  const activeMeal = useSelector((state: RootState) => state.page.activeMeal);

  const auth = authorizationStatus === AuthorizationStatus.Auth;


  return (
    <Layout>
      <Helmet>
        <title>Nutrition</title>
      </Helmet>
      { isTrainingFormOpened && <AddTraining/> }
      {
        // auth
        // &&
        <>
          <ChooseMeal/>
          {!activeMeal && <ChooseTraining/>}
        </>
      }
      { isAddMealFormOpened && <MealAddingForm/> }
      { isLoginFormOpened && <AuthForm/> }
      { isRegistrationFormOpened && <RegisterForm/> }
    </Layout>
  );
}
