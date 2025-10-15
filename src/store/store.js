import { configureStore } from "@reduxjs/toolkit";

import subwayStationReducer from './slices/subwayStationListSlice.js'
import subwayStationDetailReducer from './slices/subwayStationDetailSlice.js'
import subwayLineListSliceReducer from './slices/subwayLineListSlice.js'
import { subwayGeomReducer } from "./slices/subwayLineListSlice"; 

export default configureStore({
  reducer: {
    subwayStation: subwayStationReducer,
    subwayStationDetail: subwayStationDetailReducer,
    subwayLine: subwayLineListSliceReducer,
    subwayGeom: subwayGeomReducer,
  },
});