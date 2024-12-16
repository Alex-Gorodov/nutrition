import { FC, ReactNode, useEffect, useState, useRef } from "react";
import { Header } from "../header/header";
import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { MessagePopup } from "../message-popup/message-popup";
import { AddTraining } from "../add-training/add-training";
import { AuthForm } from "../auth-form/auth-form";
import { MealAddingForm } from "../meal-adding-form/meal-adding-form";
import { RegisterForm } from "../register-form/register-form";
import { AddMeal } from "../add-meal/add-meal";
import { MainLoader } from "../main-loader/main-loader";

type LayoutProps = {
  children: ReactNode;
};

export const Layout: FC<LayoutProps> = ({ children }) => {
  const statusMessage = useSelector((state: RootState) => state.page.statusMessage);
  const isMealsLoading = useSelector((state: RootState) => state.data.isMealsDataLoading);
  const isUsersLoading = useSelector((state: RootState) => state.data.isUsersDataLoading);

  // Лоадер должен показываться только при первой загрузке
  const hasLoadedOnce = useRef(false); // Храним состояние первичной загрузки
  const [showLoader, setShowLoader] = useState(true);

  const isPageLoading = isMealsLoading || isUsersLoading;

  // Управление состоянием отображения лоадера
  useEffect(() => {
    if (!isPageLoading && !hasLoadedOnce.current) {
      const timer = setTimeout(() => {
        setShowLoader(false); // Скрыть лоадер
        hasLoadedOnce.current = true; // Отметить, что приложение было загружено
      }, 1000); // Время анимации
      return () => clearTimeout(timer);
    }
  }, [isPageLoading]);

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
      {isAddMealFormOpened && <MealAddingForm type={ activeMealType ? activeMealType : undefined }/>}
      {isMealFormOpened && <AddMeal />}
      {isLoginFormOpened && <AuthForm />}
      {isRegistrationFormOpened && <RegisterForm />}
    </>
  );

  return (
    <div className="page-container">
      {showLoader && (
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
