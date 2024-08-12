import { configureStore } from "@reduxjs/toolkit";
// import { getDefaultNormalizer } from "@testing-library/react";
// import authReducer from '../trashbin/authSlice';
// import fbToolReducer from '../trashbin/fbToolSlice';
// import fbReducer from '../trashbin/fbSlice';

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    // fbTool: fbToolReducer,
    // fb: fbReducer,
  },
  middleware: getDefaultMiddleWare => getDefaultMiddleWare({ serializableCheck: false })
})