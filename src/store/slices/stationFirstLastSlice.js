import { createSlice } from "@reduxjs/toolkit";
import { firstLastByLine } from "../thunks/stationFirstLastThunk.js";

const initialState = {
  firstUp: [],
  firstDown: [],
  loadingFirstLast: false,
  dow: 1,           // 1=평일, 2=토, 3=공휴일 (네 로직 유지)
  error: null,
};

const stationFirstLastSlice = createSlice({
  name: "stationFirstLast",
  initialState,
  reducers: {
    setDow(state, { payload }) {
      const n = Number(payload);
      state.dow = n === 2 ? 2 : n === 3 ? 3 : 1;
    },
    clearDetail(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (b) => {
    b.addCase(firstLastByLine.pending, (s) => {
      s.loadingFirstLast = true;
      s.error = null;
    });
    b.addCase(firstLastByLine.fulfilled, (s, { payload }) => {
      s.loadingFirstLast = false;
      s.firstUp = Array.isArray(payload?.up) ? payload.up : [];
      s.firstDown = Array.isArray(payload?.down) ? payload.down : [];
      if (payload?.dow) s.dow = payload.dow;
    });
    b.addCase(firstLastByLine.rejected, (s, a) => {
      s.loadingFirstLast = false;
      s.error = a.error?.message || "첫차/막차 조회 실패";
    });
  },
});

export const { setDow, clearDetail } = stationFirstLastSlice.actions;
export default stationFirstLastSlice.reducer;
