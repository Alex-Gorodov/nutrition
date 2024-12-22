import { AuthorizationStatus, ErrorMessages, MealType, RegistrationSteps, SuccessMessages, TrainingType } from "../const";
import { store } from "../store";
import { Meal, UserMealData } from "./meal";
import { User } from "./user";
import { UserAuthData } from "./user-auth-data";

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type DataState = {
  isMealsDataLoading: boolean;
  isUsersDataLoading: boolean;
  meals: Meal[];
  users: User[];
}

export type AuthState = {
  authorizationStatus: AuthorizationStatus;
  userInfo: UserAuthData | null;
};

export type PageState = {
  isLoginFormOpened: boolean;
  isRegisterFormOpened: boolean;
  isNewMealFormOpened: boolean;
  isTrainingFormOpened: boolean;
  isMealFormOpened: boolean;
  statusMessage: SuccessMessages | ErrorMessages | null;
  registrationStep: RegistrationSteps;
  activeTraining: TrainingType | null;
  activeMealType: MealType | null;
  activeMeal: Meal | UserMealData | null;
  activeUser: User | null;
  uploadedPath: string | null;
}
