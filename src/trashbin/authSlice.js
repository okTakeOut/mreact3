import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    testAuth: (state, action) => {
      state.isLoggedIn = !state.isLoggedIn;
      console.log(state);
    },
    login: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false
    }
  }
});

export const { testAuth, login, logout } = authSlice.actions;

export default authSlice.reducer;