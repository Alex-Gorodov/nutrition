import { createReducer } from "@reduxjs/toolkit";
import { DataState } from "../../../types/state";
import { loadMeals, loadUsers, setMealsDataLoadingStatus, setUsersDataLoading, setActiveMeal } from "../../action";

const initialState: DataState = {
  isMealsDataLoading: false,
  isUsersDataLoading: false,
  meals: [],
  users: [],
  activeMeal: null,
}

export const DataReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadMeals, (state, action) => {
      state.meals = action.payload.meals;
    })
    .addCase(setMealsDataLoadingStatus, (state, action) => {
      state.isMealsDataLoading = action.payload.isMealsDataLoading;
    })
    .addCase(loadUsers, (state, action) => {
      state.users = action.payload.users;
    })
    .addCase(setUsersDataLoading, (state, action) => {
      state.isUsersDataLoading = action.payload.isUsersDataLoading;
    })
    .addCase(setActiveMeal, (state, action) => {
      state.activeMeal = action.payload.meal;
    })
})
