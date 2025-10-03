import { configureStore } from "@reduxjs/toolkit"
import subwaystationReducer from './slices/subwaystationSlice.js'
import subwayIdReducer from './slices/subwayIdSlice.js'
export default configureStore({
  reducer:{
    subwaystation : subwaystationReducer,
    subwayid : subwayIdReducer,
  }
});