import { configureStore } from "@reduxjs/toolkit";
import busReducer from "./slices/busSlice.js";
import kakaoReducer from "./slices/kakaoSlice.js";
import subwayReducer from "./slices/subwaySlice";

export const store = configureStore({
  reducer: {
     bus: busReducer,
     kakao: kakaoReducer,
     subway: subwayReducer
    },
});

export default store;