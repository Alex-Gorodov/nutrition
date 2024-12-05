import { AuthorizationStatus, ErrorMessages, RegistrationSteps, SuccessMessages, TrainingType } from "../const";
import { store } from "../store";
import { Meal } from "./meal";
import { User } from "./user";
import { UserAuthData } from "./user-auth-data";

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type DataState = {
  isMealsDataLoading: boolean;
  isUsersDataLoading: boolean;
  meals: Meal[];
  activeMeal: Meal | null;
  users: User[];
  activeUser: User | null;
  uploadedPath: string | null;
  registrationStep: RegistrationSteps;
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
  statusMessage: SuccessMessages | ErrorMessages | null;
  activeTraining: TrainingType | null;
}
