import { createSlice } from "@reduxjs/toolkit";
import { stationRealtimeIndex } from "../thunks/stationRealtimeThunk.js";
import { fetchFirstLastByLine } from "../thunks/stationFirstLastThunk.js";

const initialState = {
  realtime: [],
  loadingRealtime: false,
  firstUp: [],
  firstDown: [],
  loadingFirstLast: false,
  dow: 1,
  error: null,
};

const stationDetailSlice = createSlice({
  name: "stationDetail",
  initialState,
  reducers: {
    setDow(state, { payload }) {
      const n = Number(payload);
      state.dow = n === 2 ? 2 : n === 3 ? 3 : 1;
    },
    clearDetail(state) { Object.assign(state, initialState); },
  },
  extraReducers: (b) => {
    b.addCase(stationRealtimeIndex.fulfilled, (s, { payload }) => {
      s.loadingRealtime = false;
      s.realtime = Array.isArray(payload) ? payload : [];
    });
    b.addCase(fetchFirstLastByLine.fulfilled, (s, { payload }) => {
      s.loadingFirstLast = false;
      s.firstUp = Array.isArray(payload?.up) ? payload.up : [];
      s.firstDown = Array.isArray(payload?.down) ? payload.down : [];
      s.dow = payload?.dow ?? s.dow;
    });
    b.addMatcher(
      (a) => a.type.startsWith("stationDetail") && a.type.endsWith("/pending"),
      (s, a) => {
        s.error = null;
        if (a.type.includes("stationRealtimeIndex")) s.loadingRealtime = true;
        if (a.type.includes("fetchFirstLastByLine")) s.loadingFirstLast = true;
      }
    );
    b.addMatcher(
      (a) => a.type.startsWith("stationDetail") && a.type.endsWith("/rejected"),
      (s, a) => {
        if (a.type.includes("stationRealtimeIndex")) s.loadingRealtime = false;
        if (a.type.includes("fetchFirstLastByLine")) s.loadingFirstLast = false;
        s.error = a.error?.message || "요청 실패";
      }
    );
  },
});

export const { setDow, clearDetail } = stationDetailSlice.actions;
export default stationDetailSlice.reducer;
