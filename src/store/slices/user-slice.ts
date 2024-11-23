import { getUserFromLocalStorage } from "../../services/token";
import { createSlice } from "@reduxjs/toolkit";

const initialUserInfo = getUserFromLocalStorage();

const initialState =
  initialUserInfo || {
  id: '',
  email: '',
  token: ''
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.id = action.payload.id;
    },
    removeUser(state) {
      state.email = '';
      state.token = '';
      state.id = '';
    }
  }
})

export const {setUser, removeUser} = userSlice.actions;

export default userSlice.reducer;
