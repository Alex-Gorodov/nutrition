import { createAction } from "@reduxjs/toolkit";
import { Meal } from "../types/meal";
import { User } from "../types/user";
import { AppRoute, AuthorizationStatus, ErrorMessages, SuccessMessages } from "../const";
import { UserAuthData } from "../types/user-auth-data";

// Data fetching
export const loadMeals = createAction<{meals: Meal[]}>('data/loadMeals');
export const setMealsDataLoadingStatus = createAction<{isMealsDataLoading: boolean}>('data/setMealsDataLoadingStatus');

export const loadUsers = createAction<{users: User[]}>('data/loadUsers');
export const setUsersDataLoading = createAction<{isUsersDataLoading: boolean}>('data/setUsersDataLoadingStatus');

// Meal setting
export const setActiveMeal = createAction<{meal: Meal | null}>('data/setActiveMeal')

// New meal creating
export const addNewMeal = createAction<{meal: Meal}>('data/addNewMeal');
export const setUploadedPath = createAction<{ path: string | null }>('data/setUploadedPath');

// User
export const requireAuthorization = createAction<{authorizationStatus: AuthorizationStatus}>('user/requireAuthorization');
export const setUserInformation = createAction<{userInformation: UserAuthData}>('user/setUserInformation');
export const setActiveUser = createAction<{activeUser: UserAuthData}>('data/setActiveUser');

// Page
export const setStatusMessage = createAction<{message: ErrorMessages | SuccessMessages | null}>('page/setStatusMessage');
export const redirectToRoute = createAction<AppRoute>('page/redirectToRoute');
export const setLoginFormOpened = createAction<{isOpened: boolean}>('page/setLoginFormOpened');
export const setRegisterFormOpened = createAction<{isOpened: boolean}>('page/setRegisterFormOpened');
