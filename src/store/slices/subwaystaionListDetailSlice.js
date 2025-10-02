import { createSlice } from "@reduxjs/toolkit";
import { subwaystationIndex } from "../thunks/subwaystationThunk.js";
import { getLines } from "../../utils/subwaystaionListDetailLines.js";

const initialState = { byId: {}, total: 0 };

function keyOf(item) {
  return item?.STATION_CD || item?.statnId || item?.id || item?.STATION_NM || "";
}

const slice = createSlice({
  name: "subwaystationListDetail",
  initialState,
  reducers: {
    setFromStations(state, action) {
      const arr = Array.isArray(action.payload) ? action.payload : [];
      const map = {};
      for (const it of arr) {
        const k = keyOf(it);
        if (!k) continue;
        map[k] = getLines(it);
      }
      state.byId = map;
      state.total = Object.keys(map).length;
    },
    clear(state) {
      state.byId = {};
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(subwaystationIndex.fulfilled, (state, action) => {
      const arr = Array.isArray(action.payload) ? action.payload : action.payload?.list ?? [];
      const map = {};
      for (const it of arr || []) {
        const k = keyOf(it);
        if (!k) continue;
        map[k] = getLines(it);
      }
      state.byId = map;
      state.total = Object.keys(map).length;
    });
  },
});

export const { setFromStations, clear } = slice.actions;
export default slice.reducer;
export const selectLinesById = (s) => s.subwaystationListDetail?.byId ?? {};
export const makeStationKey = (item) =>
  item?.STATION_CD || item?.statnId || item?.id || item?.STATION_NM || "";
