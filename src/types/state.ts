import { store } from "../store";
import { Meal } from "./meal";

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type DataState = {
  isMealsDataLoading: boolean;
  meals: Meal[];
}
