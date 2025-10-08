import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { stationIndex } from "../thunks/stationThunk.js";

const initialState = {
  nameList: [],
  listPresent: [],
  searchStationNm: "",
  loading: false,
  error: null,
};

const stationSlice = createSlice({
  name: "station",
  initialState,
  reducers: {
    setSearch(state, { payload }) {
      state.searchStationNm = payload ?? "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(stationIndex.fulfilled, (state, action) => {
      state.loading = false;
      state.nameList = action.payload.nameList;
      state.listPresent = action.payload.listPresent;
    });

    // pending + rejected 하나로 묶기
    builder.addMatcher(
      isAnyOf(stationIndex.pending, stationIndex.rejected),
      (state, action) => {
        if (stationIndex.pending.match(action)) {
          // pending (요청 시작)
          state.loading = true;
          state.error = null;
        } else {
          // rejected (요청 실패)
          state.loading = false;
          state.error = action.error?.message || "failed";
        }
      }
    );
  },
});

export const { setSearch } = stationSlice.actions;
export default stationSlice.reducer;
