import { combineReducers } from "redux";
import { DataReducer } from "./reducers/data/data";
import { AuthReducer } from "./reducers/auth/auth";
import userReducer from './slices/user-slice'
import { PageReducer } from "./reducers/page/page";

export const rootReducer = combineReducers({
  data: DataReducer,
  auth: AuthReducer,
  page: PageReducer,
  user: userReducer,
})

export type RootState = ReturnType<typeof rootReducer>;
