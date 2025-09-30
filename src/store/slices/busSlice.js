// src/store/slices/busSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  busList: [],        // BusListDetail.jsx에서 쓰는 state
};

const busSlice = createSlice({
  name: 'bus',
  initialState,
  reducers: {
    setBusList(state, action) {
      state.busList = action.payload || [];
    },
    clearBusList(state) {
      state.busList = [];
    },
  },
});

export const { setBusList, clearBusList } = busSlice.actions;
// ✅ 기본 내보내기는 reducer (store에서 import busReducer 로 받기 쉽도록)
export default busSlice.reducer;
