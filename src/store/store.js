import { configureStore } from "@reduxjs/toolkit"
import subwaystationReducer from './slices/subwaystationSlice.js'
import subwatstationidReducer from './slices/subwayIdSlice.js'
export default configureStore({
  reducer:{
    subwaystation : subwaystationReducer,
    subwayid : subwatstationidReducer,
  }
});