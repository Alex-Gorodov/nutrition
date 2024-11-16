// import { dataReducer } from "./reducers/data/data";
// import { authReducer } from "./reducers/auth/auth";
// import { pageReducer } from "./reducers/page/page";
// import userReducer from './slices/user-slice'
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  // data: dataReducer,
  // auth: authReducer,
  // page: pageReducer,
  // user: userReducer
})

export type RootState = ReturnType<typeof rootReducer>;
