import { configureStore } from "@reduxjs/toolkit";

import subwayStationReducer from './slices/subwayStationListSlice.js'
import subwayStationDetailReducer from './slices/subwayStationDetailSlice.js'
import subwayLineListAndDetailSliceReducer from './slices/subwayLineListAndDetailSlice.js'
import { subwayGeomReducer } from "./slices/subwayLineListAndDetailSlice.js"; 

export default configureStore({
  reducer: {
    subwayStation: subwayStationReducer,
    subwayStationDetail: subwayStationDetailReducer,
    subwayLineListAndDetail: subwayLineListAndDetailSliceReducer,
    subwayGeom: subwayGeomReducer,
  },
});