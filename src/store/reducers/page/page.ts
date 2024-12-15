import { createReducer } from "@reduxjs/toolkit";
import { PageState } from "../../../types/state";
import { setActiveMeal, setActiveMealType, setActiveTraining, setActiveUser, setLoginFormOpened, setMealFormOpened, setNewMealFormOpened, setRegisterFormOpened, setRegistrationStep, setStatusMessage, setTrainingFormOpened, setUploadedPath } from "../../action";
import { RegistrationSteps } from "../../../const";
import { getUserFromLocalStorage } from "../../../services/token";

const initialState: PageState = {
  registrationStep: RegistrationSteps.None,
  isLoginFormOpened: false,
  isRegisterFormOpened: false,
  isNewMealFormOpened: false,
  isTrainingFormOpened: false,
  isMealFormOpened: false,
  statusMessage: null,
  activeTraining: null,
  activeMealType: null,
  activeMeal: null,
  activeUser: null,
  uploadedPath: null,
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
    .addCase(setMealFormOpened, (state, action) => {
      state.isMealFormOpened = action.payload.isOpened;
    })
    .addCase(setRegistrationStep, (state, action) => {
      state.registrationStep = action.payload.step;
    })
    .addCase(setActiveMealType, (state, action) => {
      state.activeMealType = action.payload.type || null;
    })
    .addCase(setActiveMeal, (state, action) => {
      state.activeMeal = action.payload.meal;
    })
    .addCase(setUploadedPath, (state, action) => {
      const { path } = action.payload;
      state.uploadedPath = path;
    })
    .addCase(setActiveUser, (state) => {
      const userFromLocalStorage = getUserFromLocalStorage();
      state.activeUser = userFromLocalStorage;
    })
})
