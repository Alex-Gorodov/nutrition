import { createReducer } from "@reduxjs/toolkit";
import { DataState } from "../../../types/state";
import { loadMeals, loadUsers, setMealsDataLoadingStatus, setUsersDataLoading, addNewMeal, trackUserMeal, trackUserTrainingSession, setUserWeight, setUserTarget } from "../../action";
import { getUserFromLocalStorage } from "../../../services/token";
import { RegistrationSteps } from "../../../const";

const initialState: DataState = {
  isMealsDataLoading: false,
  isUsersDataLoading: false,
  meals: [],
  users: [],
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
    .addCase(addNewMeal, (state, action) => {
      const newMeal = action.payload.meal;
      state.meals.push(newMeal);
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
    .addCase(setUserWeight, (state, action) => {
      const { user, newWeight } = action.payload;
      const userIndex = state.users.findIndex((u) => u.id === user.id);

      if (userIndex !== -1) {
        state.users[userIndex].weight = newWeight;
      } else {
        console.error('User not found in state');
      }
    })
    .addCase(setUserTarget, (state, action) => {
      const { user, newTarget } = action.payload;
      const userIndex = state.users.findIndex((u) => u.id === user.id);

      if (userIndex !== -1) {
        state.users[userIndex].target = newTarget;
      } else {
        console.error('User not found in state');
      }
    })
})
