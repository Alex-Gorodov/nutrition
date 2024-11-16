import { createReducer } from "@reduxjs/toolkit";
import { DataState } from "../../../types/state";
import { loadMeals, setMealsDataLoadingStatus } from "../../action";

const initialState: DataState = {
  isMealsDataLoading: false,
  meals: [],
}

export const DataReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadMeals, (state, action) => {
      state.meals = action.payload.meals;
    })
    .addCase(setMealsDataLoadingStatus, (state, action) => {
      state.isMealsDataLoading = action.payload.isMealsDataLoading;
    })
})
