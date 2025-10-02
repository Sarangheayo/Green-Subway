import { createSlice } from "@reduxjs/toolkit";

const subwayIdSlice = createSlice({
  name: 'subwayIdSlice',
  initialState: {
    subwayInfo: {},
  },
  reducers : {
    setSubwayInfo(state, action){
      state.subwayInfo = action.payload;
    },
  }
});

export const {
  setSubwayInfo
} = subwayIdSlice.actions;

export default subwayIdSlice.reducer;