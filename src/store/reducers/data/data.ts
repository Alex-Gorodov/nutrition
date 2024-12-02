import { createReducer } from "@reduxjs/toolkit";
import { DataState } from "../../../types/state";
import { loadMeals, loadUsers, setMealsDataLoadingStatus, setUsersDataLoading, setActiveMeal, addNewMeal, setUploadedPath, setActiveUser, setRegistrationStep, trackUserMeal, trackUserTrainingSession } from "../../action";
import { getUserFromLocalStorage } from "../../../services/token";
import { RegistrationSteps } from "../../../const";

const initialState: DataState = {
  registrationStep: RegistrationSteps.None,
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
    })
    .addCase(setRegistrationStep, (state, action) => {
      state.registrationStep = action.payload.step;
    })
    .addCase(trackUserMeal, (state, action) => {
      const { user, meal } = action.payload;
      const date = new Date();
      const userIndex = state.users.findIndex((u) => u.id === user.id);

      if (userIndex !== -1) {
        if (!state.users[userIndex].mealSchedule) {
          state.users[userIndex].mealSchedule = [];
        }
        state.users[userIndex].mealSchedule.push([meal, date]);
      } else {
        console.error('User not found in state');
      }
    })
    .addCase(trackUserTrainingSession, (state, action) => {
      const { user, session } = action.payload;
      const userIndex = state.users.findIndex((u) => u.id === user.id);

      if (userIndex !== -1) {
        if (!state.users[userIndex].trainingSessions) {
          state.users[userIndex].trainingSessions = [];
        }
        state.users[userIndex].trainingSessions.push(session);
      } else {
        console.error('User not found in state');
      }
    })
})
