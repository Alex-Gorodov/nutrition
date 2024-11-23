import { createReducer } from "@reduxjs/toolkit";
import { DataState } from "../../../types/state";
import { loadMeals, loadUsers, setMealsDataLoadingStatus, setUsersDataLoading, setActiveMeal, addNewMeal, setUploadedPath, setActiveUser } from "../../action";
import { getUserFromLocalStorage } from "../../../services/token";

const initialState: DataState = {
  isMealsDataLoading: false,
  isUsersDataLoading: false,
  meals: [],
  users: [],
  activeMeal: null,
  activeUser: null,
  uploadedPath: null,
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
    .addCase(addNewMeal, (state, action) => {
      const newMeal = action.payload.meal;
      state.meals.push(newMeal);
    })
    .addCase(setUploadedPath, (state, action) => {
      const { path } = action.payload;
      state.uploadedPath = path;
    })
    .addCase(setActiveUser, (state, action) => {
      const userFromState = state.users.find((user) => user.id === action.payload.activeUser.id);
      const userFromLocalStorage = getUserFromLocalStorage();
      state.activeUser = userFromState || userFromLocalStorage;
    });
})
