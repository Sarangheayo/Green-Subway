import { configureStore } from "@reduxjs/toolkit";
import kakaoReducer from "./slices/kakaoSlice.js";
import subwayReducer from "./slices/subwaySlice";

export const store = configureStore({
  reducer: {
     kakao: kakaoReducer,
     subway: subwayReducer
    },
});

export default store;