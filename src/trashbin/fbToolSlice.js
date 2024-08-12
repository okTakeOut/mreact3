import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authState: {
    isLoggedIn: false,
    userQuery: null,
  },
  scheduleState: {
    schedules: [],
    sortFilter: "scheduleId",
    currentSchedule: [],
  },
};

const fbToolSlice = createSlice({
  name: "fbTool",
  initialState,
  reducers: {
    changeUserQuery: (state, action) => {
      if (!action) {
        state.authState.userQuery = null;
        return;
      }
      state.authState.userQuery = action.payload;
    },

    login: (state) => {
      state.authState.isLoggedIn = true;
    },

    logout: (state) => {
      state.authState.isLoggedIn = false
    },

    addSchedule: (state, action) => {
      console.log("payload: ", action.payload)
      state.scheduleState.schedules = action.payload;
    },

    changeCurrentSchedule: (state, action) => {
      state.scheduleState.currentSchedule = action.payload;
    },

    sortFilterChange: (state, action) => {
      state.scheduleState.sortFilter = action.payload
    },
  }
});

export const { addSchedule, sortFilterChange, changeCurrentSchedule, changeUserQuery, login, logout } = fbToolSlice.actions;

export default fbToolSlice.reducer;