import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user.slice.js";
import loadingReducer from "./loading.slice.js";
const store = configureStore({
  reducer: {
    user: userReducer,
    loading: loadingReducer,
  },
});

export default store;
