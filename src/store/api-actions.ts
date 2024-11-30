import { createAsyncThunk, ThunkDispatch } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { RootState } from "./root-reducer";
import { database } from "../services/database";
import { APIRoute, AuthorizationStatus } from "../const";
import { Meal } from "../types/meal";
import { loadMeals, loadUsers, requireAuthorization, setMealsDataLoadingStatus, setUserInformation, setUsersDataLoading } from "./action";
import { User } from "../types/user";
import { UserAuthData } from "../types/user-auth-data";
import { AuthData } from "../types/authData";
import { removeUserFromLocalStorage, saveToken } from "../services/token";
import { AppDispatch } from "../types/state";
import { removeUser, setUser } from "./slices/user-slice";

export type ThunkOptions = {
  dispatch: ThunkDispatch<RootState, AxiosInstance, any>;
  state: RootState;
  extra: AxiosInstance;
};

export const fetchMealsAction = createAsyncThunk<void, undefined, ThunkOptions>(
  'data/fetchMeals', async (_arg, {dispatch}) => {
    try {
      dispatch(setMealsDataLoadingStatus({isMealsDataLoading: true}));
      const data = (await database.ref(APIRoute.Meals).once("value")).val();
      const meals: Meal[] = data ? Object.values(data) : [];
      dispatch(loadMeals({meals}));
      dispatch(setMealsDataLoadingStatus({isMealsDataLoading: false}));
    } catch(e) {
      console.error('Error fetching meals from database', e);
      dispatch(setMealsDataLoadingStatus({isMealsDataLoading: false}));
    } finally {
      dispatch(setMealsDataLoadingStatus({isMealsDataLoading: false}))
    }
  }
)

export const fetchUsersAction = createAsyncThunk<void, undefined, ThunkOptions>(
  'data/fetchUsers', async (_arg, {dispatch}) => {
    try {
      dispatch(setUsersDataLoading({isUsersDataLoading: true}));
      const data = (await database.ref(APIRoute.Users).once("value")).val();
      const users: User[] = data ? Object.values(data) : [];
      dispatch(loadUsers({users}));
      dispatch(setUsersDataLoading({isUsersDataLoading: false}));
    } catch(e) {
      console.error('Error fetching user from database', e);
      dispatch(setUsersDataLoading({isUsersDataLoading: false}));
    } finally {
      dispatch(setUsersDataLoading({isUsersDataLoading: false}));
    }
  }
)

export const addMealToDatabase = async (meal: Meal) => {
  try {
    const mealRef = database.ref(`${APIRoute.Meals}`);
    const snapshot = await mealRef.once('value');
    let mealData = snapshot.val();

    if (!mealData) {
      mealData = { meals: [] };
    }

    const newMeal = {
      id: meal.id,
      name: meal.name,
      ingredients: meal.ingredients,
      type: meal.type,
      recipe: meal.recipe,
      picture: meal.picture,
      calories: meal.calories,
      proteins: meal.proteins,
      fats: meal.fats,
      carbs: meal.carbs,
    };

    mealData.meals.push(newMeal);

    await mealRef.set(mealData);
  } catch (error) {
    console.error("Error adding meal: ", error);
  }
};

export const addNewUserToDatabase = async (user: User, dispatch: AppDispatch) => {
  try {
    const userRef = database.ref(APIRoute.Users);
    await userRef.push(user);

    const snapshot = await userRef.once('value');
    const usersArray: User[] = [];
    snapshot.forEach(childSnapshot => {
      usersArray.push(childSnapshot.val());
    });

    dispatch(loadUsers({ users: usersArray }));
    console.log('new user added!');

  } catch (error) {
    console.error('Error adding new user to database:', error);
  }
};

export const loginAction = createAsyncThunk<
  UserAuthData,
  AuthData,
  ThunkOptions
>(
  'user/login',
  async ({ login: email, password }, { extra: api }) => {
    const { data } = await api.post<UserAuthData>(APIRoute.Login, {
      email,
      password,
    });
    saveToken(data.token);
    localStorage.setItem('nutrition-user', JSON.stringify(data));
    return data;
  }
);

export const logoutAction = createAsyncThunk<
  void,
  undefined,
  ThunkOptions
>(
  'user/logout',
  async (_arg, { dispatch }) => {
    try {
      removeUserFromLocalStorage();
      dispatch(requireAuthorization({authorizationStatus: AuthorizationStatus.NoAuth}));
      dispatch(setUserInformation({
        userInformation: {
          id: '',
          email: '',
          token: ''
        }
      }))
      dispatch(removeUser())
      dispatch(setUser({
        email: '',
        id: '',
        token: ''
      }))
    } catch (error) {
      console.error('Failed to logout', error);
    }
  }
);
