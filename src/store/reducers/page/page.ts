import { createReducer } from "@reduxjs/toolkit";
import { PageState } from "../../../types/state";
import { setActiveTraining, setLoginFormOpened, setNewMealFormOpened, setRegisterFormOpened, setStatusMessage, setTrainingFormOpened } from "../../action";

const initialState: PageState = {
  isLoginFormOpened: false,
  isRegisterFormOpened: false,
  isNewMealFormOpened: false,
  isTrainingFormOpened: false,
  statusMessage: null,
  activeTraining: null,
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
    .addCase(setActiveTraining, (state, action) => {
      state.activeTraining = action.payload.training;
    })
    .addCase(setNewMealFormOpened, (state, action) => {
      state.isNewMealFormOpened = action.payload.isOpened;
    })
    .addCase(setTrainingFormOpened, (state, action) => {
      state.isTrainingFormOpened = action.payload.isOpened;
    })
})
