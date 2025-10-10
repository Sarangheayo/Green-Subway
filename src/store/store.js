import { configureStore } from "@reduxjs/toolkit";
import stationReducer from "./slices/stationSlice.js";
import stationFirstLastReducer from "./slices/stationFirstLastSlice.js";
import stationRealtimeReducer from "./slices/stationRealtimeSlice.js";

export default configureStore({
  reducer: {
    station: stationReducer,
    stationFirstLast: stationFirstLastReducer,
    stationRealtime: stationRealtimeReducer,
  },
});