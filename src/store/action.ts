import { createAction } from "@reduxjs/toolkit";
import { Meal } from "../types/meal";

export const loadMeals = createAction<{meals: Meal[]}>('data/loadMeals');
export const setMealsDataLoadingStatus = createAction<{isMealsDataLoading: boolean}>('data/setMealsDataLoadingStatus');
