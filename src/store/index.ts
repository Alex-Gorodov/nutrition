import { configureStore } from '@reduxjs/toolkit';
import { redirect } from './middlewares/redirect';
import { createAPI } from '../services/api';
import { rootReducer } from './root-reducer';

export const api = createAPI();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
      serializableCheck: false,
    }).concat(redirect)
});
