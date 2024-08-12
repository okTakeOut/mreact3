import { createSlice } from "@reduxjs/toolkit";
// 쓰고있는거
const initialState = {
  pageState: {
    isPending: false,
    error: null,
    settings: {
      loginEnable: true,
      maxNumberAccountPerDay: 5,
      isReadOnly: false,
    }
  },
  authState: {
    isLoggedIn: false,
    userDetails: {
      uid: "",
      displayName: "",
      lastAccess: "",
      todayPosting: "",
    },
  }
};

const fbSlice = createSlice({
  name: "fbSlice",
  initialState,
  reducers: {
    changeIsPending: (state, action) => {
      console.log("changeIsPending")
      state.pageState.isPending = action.payload;
    },
    changeError: (state, action) => {
      state.pageState.error = action.payload
    },
    login: (state) => {
      state.authState.isLoggedIn = true;
    },
    logout: (state) => {
      state.authState.isLoggedIn = false;
    },
    changeUserDetails: (state, action) => {
      state.authState.userDetails = action.payload
    },
    clearUserDetails: (state) => {
      state.authState.userDetails = {}
    },
    changeSettings: (state, action) => {
      if (action.payload.type === "loginEnable") {
        state.pageState.settings.loginEnable = !state.pageState.settings.loginEnable
        return
      }
      if (action.payload.type === "maxNumberAccountPerDay") {
        state.pageState.settings.maxNumberAccountPerDay = action.payload
        return
      }
      if (action.payload.type === "isReadOnly") {
        state.pageState.settings.isReadOnly = !state.pageState.settings.isReadOnly
        return;
      }
      if (action.payload.type === "Test") {
        console.log(new Date(), 123)
        return
      }
      else {
        state.pageState.settings = action.payload
      }
    },
    printSettings: (state) => {
      console.log("[FB][settings]: ")
      console.log(
        state.pageState.settings.loginEnable,
        state.pageState.settings.isReadOnly,
        state.pageState.settings.maxNumberAccountPerDay
      )
    }
  }
});

export const {
  changeIsPending,
  changeError,
  login,
  logout,
  changeUserDetails,
  clearUserDetails,
  changeSettings,
  printSettings
} = fbSlice.actions;

export default fbSlice.reducer;