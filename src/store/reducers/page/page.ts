import { createReducer } from "@reduxjs/toolkit";
import { PageState } from "../../../types/state";
import { setLoginFormOpened, setRegisterFormOpened, setStatusMessage } from "../../action";

const initialState: PageState = {
  isLoginFormOpened: false,
  isRegisterFormOpened: false,
  statusMessage: null,
}

export const PageReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setLoginFormOpened, (state, action) => {
      state.isLoginFormOpened = action.payload.isOpened;
    })
    .addCase(setRegisterFormOpened, (state, action) => {
      state.isRegisterFormOpened = action.payload.isOpened;
    })
    .addCase(setStatusMessage, (state, action) => {
      state.statusMessage = action.payload.message;
    })
})
