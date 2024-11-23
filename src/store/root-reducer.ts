import { combineReducers } from "redux";
import { DataReducer } from "./reducers/data/data";
import { AuthReducer } from "./reducers/auth/auth";
import userReducer from './slices/user-slice'

export const rootReducer = combineReducers({
  data: DataReducer,
  auth: AuthReducer,
  user: userReducer,
})

export type RootState = ReturnType<typeof rootReducer>;
