import { createAsyncThunk, ThunkDispatch } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { RootState } from "./root-reducer";
import { database } from "../services/database";
import { APIRoute, AuthorizationStatus, NutritionTarget, TrainingSession } from "../const";
import { Meal } from "../types/meal";
import { loadMeals, loadUsers, requireAuthorization, setMealsDataLoadingStatus, setUserInformation, setUsersDataLoading, setUserTarget, setUserWeight, trackUserMeal, trackUserTrainingSession } from "./action";
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

export const addMealToUserSchedule = async (
  user: User,
  meal: Meal,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    const userRef = database.ref(APIRoute.Users);
    const snapshot = await userRef.orderByChild('id').equalTo(user.id).once('value');

    if (snapshot.exists()) {
      const key = Object.keys(snapshot.val())[0];
      const existingUser = snapshot.val()[key];

      const updatedScheduleItems: [Meal, Date][] = (existingUser.mealSchedule || []).map((item: any) =>
        Array.isArray(item) ? item : [item, new Date()]
      );

      updatedScheduleItems.push([meal, new Date()]);
      await userRef.child(key).update({ mealSchedule: updatedScheduleItems });
      dispatch(trackUserMeal({user: user, meal: meal}))
      console.log('Meal successfully added to user schedule');
    } else {
      console.log('User not found in the database');
    }
  } catch (error) {
    console.error('Error adding meal to schedule:', error);
  }
};

export const addTrainingSessionToUser = async (
  user: User,
  training: TrainingSession,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    const userRef = database.ref(APIRoute.Users);
    const snapshot = await userRef.orderByChild('id').equalTo(user.id).once('value');

    if (snapshot.exists()) {
      const key = Object.keys(snapshot.val())[0];
      const existingUser = snapshot.val()[key];

      const updatedTrainingSessions: TrainingSession[] = existingUser.trainingSessions || [];

      updatedTrainingSessions.push(training);

      await userRef.child(key).update({ trainingSessions: updatedTrainingSessions });
      dispatch(trackUserTrainingSession({user: user, session: training}));
      console.log("Training session successfully added to user schedule.");
    } else {
      console.log("User not found in the database.");
    }
  } catch (error) {
    console.error("Error adding training session to user schedule:", error);
  }
};

export const updateUserWeight = async (
  user: User,
  newWeight: number,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    const userRef = database.ref(APIRoute.Users);
    const snapshot = await userRef.orderByChild('id').equalTo(user.id).once('value');

    if (snapshot.exists()) {
      const key = Object.keys(snapshot.val())[0];

      await userRef.child(key).update({ weight: newWeight });
      dispatch(setUserWeight({user, newWeight}));
      console.log("User weight was successfully updated!");
    }
  } catch (error) {
    console.error("Error updating user weight:", error);
  }
}

export const updateUserTarget = async (
  user: User,
  newTarget: NutritionTarget,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    const userRef = database.ref(APIRoute.Users);
    const snapshot = await userRef.orderByChild('id').equalTo(user.id).once('value');

    if (snapshot.exists()) {
      const key = Object.keys(snapshot.val())[0];

      const targetToUpdate = newTarget || NutritionTarget.WeightMaintenance;

      await userRef.child(key).update({ target: targetToUpdate });
      dispatch(setUserTarget({ user, newTarget: targetToUpdate }));
      console.log("User target was successfully updated!");
    }
  } catch (error) {
    console.error("Error updating user target:", error);
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
