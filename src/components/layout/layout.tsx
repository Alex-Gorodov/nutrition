import { FC, ReactNode, useEffect, useState, useRef } from "react";
import { Header } from "../header/header";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { MessagePopup } from "../message-popup/message-popup";
import { AddTraining } from "../add-training/add-training";
import { AuthForm } from "../auth-form/auth-form";
import { MealAddingForm } from "../meal-adding-form/meal-adding-form";
import { RegisterForm } from "../register-form/register-form";
import { AddMeal } from "../add-meal/add-meal";
import { MainLoader } from "../main-loader/main-loader";
import { AuthorizationStatus, MealType } from "../../const";
import { useParams } from "react-router-dom";
// import { setActiveMealType } from "../../store/action";

type LayoutProps = {
  children: ReactNode;
};

export const Layout: FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { type } = useParams<{ type: MealType }>();
  const statusMessage = useSelector((state: RootState) => state.page.statusMessage);
  const isMealsLoading = useSelector((state: RootState) => state.data.isMealsDataLoading);
  const isUsersLoading = useSelector((state: RootState) => state.data.isUsersDataLoading);
  const isUser = useSelector((state: RootState) => state.auth.authorizationStatus === AuthorizationStatus.Auth);

  const hasLoadedOnce = useRef(false);
  const [showLoader, setShowLoader] = useState(true);

  const isPageLoading = (isMealsLoading || isUsersLoading);

  useEffect(() => {
    // type && dispatch(setActiveMealType({type}))
    if (isUser) {
      const isPageLoading = isMealsLoading || isUsersLoading;

      if (!isPageLoading && !hasLoadedOnce.current) {
        const timer = setTimeout(() => {
          setShowLoader(false);
          hasLoadedOnce.current = true;
        }, 1000);
        return () => clearTimeout(timer);
      }
    } else {
      setShowLoader(false);
    }
  }, [isUser, isMealsLoading, isUsersLoading, type, dispatch]);

  const isLoginFormOpened = useSelector((state: RootState) => state.page.isLoginFormOpened);
  const isRegistrationFormOpened = useSelector((state: RootState) => state.page.isRegisterFormOpened);
  const isAddMealFormOpened = useSelector((state: RootState) => state.page.isNewMealFormOpened);
  const isTrainingFormOpened = useSelector((state: RootState) => state.page.isTrainingFormOpened);
  const isMealFormOpened = useSelector((state: RootState) => state.page.isMealFormOpened);

  const activeMealType = useSelector((state: RootState) => state.page.activeMealType);

  const Modals = () => (
    <>
      {statusMessage && <MessagePopup message={ statusMessage } />}
      {isTrainingFormOpened && <AddTraining/>}
      {isAddMealFormOpened && <MealAddingForm type={type || activeMealType || undefined}/>}
      {isMealFormOpened && <AddMeal />}
      {isLoginFormOpened && <AuthForm />}
      {isRegistrationFormOpened && <RegisterForm />}
    </>
  );

  return (
    <div className="page-container">
      {isUser && showLoader && (
        <MainLoader
          isPageLoading={isPageLoading}
          onAnimationEnd={() => setShowLoader(false)}
        />
      )}
      {!showLoader && (
        <>
          <Header />
            <main className="main">
              <div className="main__container">
                {children}
              </div>
            </main>
          <Modals />
        </>
      )}
    </div>
  );
};
