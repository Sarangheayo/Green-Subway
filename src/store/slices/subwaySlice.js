// src/store/slices/subwaySlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchRealtimePosition } from "../thunks/subwayThunk";

const initialState = {
  list: [],
  loading: false,
  error: null,
  lastLine: "",
};

const subwaySlice = createSlice({
  name: "subway",
  initialState,
  reducers: {
    resetSubway(state) {
      state.list = [];
      state.loading = false;
      state.error = null;
      state.lastLine = "";
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchRealtimePosition.pending, (s, a) => {
      s.loading = true;
      s.error = null;
      s.lastLine = a.meta.arg?.subwayNm || "";
    });
    b.addCase(fetchRealtimePosition.fulfilled, (s, a) => {
      s.loading = false;
      s.list = a.payload || [];
    });
    b.addCase(fetchRealtimePosition.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload || a.error?.message || "error";
      s.list = [];
    });
  },
});

export const { resetSubway } = subwaySlice.actions;
export default subwaySlice.reducer;

// selectors
export const selectSubwayList = (s) => s.subway.list;
export const selectSubwayLoading = (s) => s.subway.loading;
export const selectSubwayError = (s) => s.subway.error;
export const selectSubwayLastLine = (s) => s.subway.lastLine;
