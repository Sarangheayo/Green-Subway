import { configureStore } from "@reduxjs/toolkit";
import stationReducer from "./slices/stationSlice.js";
import stationDetailReducer from "./slices/stationDetailSlice.js";
import stationRealtimeReducer from "./slices/stationRealtimeSlice.js";

export default configureStore({
  reducer: {
    station: stationReducer,
    stationDetail: stationDetailReducer,
    stationRealtime: stationRealtimeReducer,
  },
});