import { createAsyncThunk, ThunkDispatch } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { RootState } from "./root-reducer";
import { database } from "../services/database";
import { APIRoute } from "../const";
import { Meal } from "../types/meal";
import { loadMeals, setMealsDataLoadingStatus } from "./action";

export type ThunkOptions = {
  dispatch: ThunkDispatch<RootState, AxiosInstance, any>;
  state: RootState;
  extra: AxiosInstance;
};

export const fetchMealsAction = createAsyncThunk<void, undefined, ThunkOptions>(
  'data/fetchMeals', async (_arg, {dispatch}) => {
    try {
      const data = (await database.ref(APIRoute.Meals).once("value")).val();
      const items: Meal[] = data ? Object.values(data) : [];

      dispatch(setMealsDataLoadingStatus({isMealsDataLoading: true}));
      dispatch(loadMeals({meals: items}));
      dispatch(setMealsDataLoadingStatus({isMealsDataLoading: false}));
    } catch(e) {
      console.error('Error fetching meals from database', e);
      dispatch(setMealsDataLoadingStatus({isMealsDataLoading: false}));
    }
  }
)
