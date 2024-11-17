import { store } from "../store";
import { Meal } from "./meal";
import { User } from "./user";

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type DataState = {
  isMealsDataLoading: boolean;
  isUsersDataLoading: boolean;
  meals: Meal[];
  activeMeal: Meal | null;
  users: User[];
}
