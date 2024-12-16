import { FC, ReactNode } from 'react';
import { Header } from '../header/header';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/root-reducer';
import { MessagePopup } from '../message-popup/message-popup';
import { AddTraining } from '../add-training/add-training';
import { AuthForm } from '../auth-form/auth-form';
import { MealAddingForm } from '../meal-adding-form/meal-adding-form';
import { RegisterForm } from '../register-form/register-form';
import { AddMeal } from '../add-meal/add-meal';

type LayoutProps = {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const statusMessage = useSelector((state: RootState) => state.page.statusMessage);

  const isLoginFormOpened = useSelector((state: RootState) => state.page.isLoginFormOpened)
  const isRegistrationFormOpened = useSelector((state: RootState) => state.page.isRegisterFormOpened);
  const isAddMealFormOpened = useSelector((state: RootState) => state.page.isNewMealFormOpened);
  const isTrainingFormOpened = useSelector((state: RootState) => state.page.isTrainingFormOpened);
  const isMealFormOpened = useSelector((state: RootState) => state.page.isMealFormOpened);

  return (
    <div className="page-container">
      <Header />
      <main className="main">
        {children}
      </main>
      { statusMessage && <MessagePopup message={statusMessage}/> }
      { isTrainingFormOpened && <AddTraining isLocked={true}/> }
      { isAddMealFormOpened && <MealAddingForm/> }
      { isMealFormOpened && <AddMeal/>}
      { isLoginFormOpened && <AuthForm/> }
      { isRegistrationFormOpened && <RegisterForm/> }
      {/* <Footer /> */}
    </div>
  );
};
