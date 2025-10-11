import { createSlice } from "@reduxjs/toolkit";
import stationRealtimeIndex from "../thunks/stationRealtimeThunk.js";

const initialState = {
  list: [],      // 실시간 도착 정보
  loading: false,
  error: null,
};

const stationRealtimeSlice = createSlice({
  name: "stationRealtime",
  initialState,
  reducers: {
    clearRealtime(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(stationRealtimeIndex.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(stationRealtimeIndex.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(stationRealtimeIndex.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "실시간 도착정보 요청 실패";
      });
  },
});


export const { clearRealtime } = stationRealtimeSlice.actions;
export default stationRealtimeSlice.reducer;

