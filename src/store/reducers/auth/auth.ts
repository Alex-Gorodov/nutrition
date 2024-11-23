import { ActionReducerMapBuilder, createReducer } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../../../const';
import { AuthState } from '../../../types/state';
import { requireAuthorization, setUserInformation } from '../../action';
import { getUserFromLocalStorage } from '../../../services/token';
import { setUser } from '../../slices/user-slice';

const initialUserInfo = getUserFromLocalStorage();

const initialState: AuthState = {
  authorizationStatus: initialUserInfo ? AuthorizationStatus.Auth : AuthorizationStatus.Unknown,
  userInfo: initialUserInfo || {
    id: '',
    email: '',
    token: '',
  },
};

export const AuthReducer = createReducer(
  initialState,
  (builder: ActionReducerMapBuilder<AuthState>): void => {
    builder
      .addCase(requireAuthorization, (state: AuthState, action): void => {
        const { authorizationStatus } = action.payload;
        state.authorizationStatus = authorizationStatus;
      })
      .addCase(setUserInformation, (state, action) => {
        const { userInformation } = action.payload;
        state.userInfo = userInformation;
      })
      .addCase(setUser, (state, action) => {
        const { email, token, id } = action.payload;
        const localUserInfo = getUserFromLocalStorage();
        state.userInfo = {
          id: id || localUserInfo?.id || '',
          email: email || localUserInfo?.email || '',
          token: token || localUserInfo?.token || '',
        };
        state.authorizationStatus = state.userInfo.token
          ? AuthorizationStatus.Auth
          : AuthorizationStatus.Unknown;
      });
  }
);
