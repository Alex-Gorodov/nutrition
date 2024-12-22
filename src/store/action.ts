import { createAction } from "@reduxjs/toolkit";
import { Meal, UserMealData } from "../types/meal";
import { User } from "../types/user";
import { ActivityLevel, AppRoute, AuthorizationStatus, ErrorMessages, MealType, NutritionTarget, RegistrationSteps, SuccessMessages, TrainingType } from "../const";
import { UserAuthData } from "../types/user-auth-data";
import { TrainingSession } from "../types/trainingSession";

// Data fetching
export const loadMeals = createAction<{meals: Meal[]}>('data/loadMeals');
export const setMealsDataLoadingStatus = createAction<{isMealsDataLoading: boolean}>('data/setMealsDataLoadingStatus');
export const loadUsers = createAction<{users: User[]}>('data/loadUsers');
export const setUsersDataLoading = createAction<{isUsersDataLoading: boolean}>('data/setUsersDataLoadingStatus');
export const setActiveUser = createAction<{activeUser: UserAuthData}>('data/setActiveUser');
export const removeMeal = createAction<{user: User, meal: Meal | UserMealData}>('data/removeMeal');
export const removeTrainingSession = createAction<{user: User, training: TrainingSession}>('data/removeTrainingSession');

// User data updating
export const setUserWeight = createAction<{user: User, newWeight: number}>('data/setUserWeight');
export const setUserTarget = createAction<{user: User, newTarget: NutritionTarget}>('data/setUserTarget');
export const setUserActivity = createAction<{user: User, newActivity: ActivityLevel}>('data/setUserActivity');

// New meal creating
export const addNewMeal = createAction<{meal: Meal}>('data/addNewMeal');
export const setUploadedPath = createAction<{ path: string | null }>('data/setUploadedPath');

// User
export const requireAuthorization = createAction<{authorizationStatus: AuthorizationStatus}>('user/requireAuthorization');
export const setUserInformation = createAction<{userInformation: UserAuthData}>('user/setUserInformation');
export const trackUserMeal = createAction<{user: User, meal: Meal}>('user/trackUserMeal');
export const trackUserTrainingSession = createAction<{user: User, session: TrainingSession}>('user/trackUserTrainingSession');

// Page
export const setActiveMealType = createAction<{type: MealType | null}>('page/setActiveMealType')
export const setActiveMeal = createAction<{meal: UserMealData | null}>('page/setActiveMeal')
export const setStatusMessage = createAction<{message: ErrorMessages | SuccessMessages | null}>('page/setStatusMessage');
export const redirectToRoute = createAction<AppRoute>('page/redirectToRoute');
export const setLoginFormOpened = createAction<{isOpened: boolean}>('page/setLoginFormOpened');
export const setRegisterFormOpened = createAction<{isOpened: boolean}>('page/setRegisterFormOpened');
export const setRegistrationStep = createAction<{step: RegistrationSteps}>('page/changeRegistrationStep');
export const setActiveTraining = createAction<{training: TrainingType | null}>('page/setActiveTraining');
export const setNewMealFormOpened = createAction<{isOpened: boolean}>('page/setNewMealFormOpened');
export const setTrainingFormOpened = createAction<{isOpened: boolean}>('page/setTrainingFormOpened');
export const setMealFormOpened = createAction<{isOpened: boolean}>('page/setMealFormOpened');
