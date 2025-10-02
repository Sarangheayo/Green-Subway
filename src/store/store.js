import { configureStore } from "@reduxjs/toolkit"
import subwaystationReducer from './slices/subwaystationSlice.js'
import subwatstationidReducer from './slices/subwayIdSlice.js'
import subwaystationListDetailReducer from "./slices/subwaystaionListDetailSlice.js";

export default configureStore({
  reducer:{
    subwaystation : subwaystationReducer,
    subwayid : subwatstationidReducer,
    subwaystationListDetail : subwaystationListDetailReducer,
  }
});