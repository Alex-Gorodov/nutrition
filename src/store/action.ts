import { createAction } from "@reduxjs/toolkit";
import { Meal } from "../types/meal";
import { User } from "../types/user";

export const loadMeals = createAction<{meals: Meal[]}>('data/loadMeals');
export const setMealsDataLoadingStatus = createAction<{isMealsDataLoading: boolean}>('data/setMealsDataLoadingStatus');

export const loadUsers = createAction<{users: User[]}>('data/loadUsers');
export const setUsersDataLoading = createAction<{isUsersDataLoading: boolean}>('data/setUsersDataLoadingStatus');

export const setActiveMeal = createAction<{meal: Meal | null}>('data/setActiveMeal')
